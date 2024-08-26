"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import {
  CodebaseInfo,
  createFunctionCallBlock,
  FunctionInfo,
} from "@ozhanefe/ts-codegenerator";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { KeyCombinationLabel } from "@ui/key-combination-label";

export const SearchDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FunctionInfo[]>([]);
  const { state, setState, codebaseInfo } = useCodeGenerator();

  const addFunction = useCallback(
    (func: FunctionInfo) => {
      const { state: newState } = createFunctionCallBlock(func, state);

      setState(newState);
    },
    [state, setState]
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (open) {
        if (event.ctrlKey && event.key >= "1" && event.key <= "9") {
          event.preventDefault();
          const index = parseInt(event.key) - 1;
          if (index < searchResults.length) {
            addFunction(searchResults[index]);
          }
        } else if (event.key === "Escape") {
          setOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, searchResults, state]);

  useEffect(() => {
    if (!codebaseInfo) return;

    if (searchQuery === "") {
      setSearchResults([]);
    } else {
      setSearchResults(
        codebaseInfo.functions.filter((func) =>
          func.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, codebaseInfo]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Search Codebase (⌘K)</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Codebase</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search for functions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="my-4"
        />
        <div className="max-h-[300px] overflow-y-auto">
          {searchQuery === "" ? (
            <p className="text-center text-gray-500">
              Type to search, or don&apos;t. I&apos;m a dialog, not a cop.
            </p>
          ) : searchResults.length === 0 ? (
            <p className="text-center text-gray-500">
              No results found. Did you break the code again?
            </p>
          ) : (
            searchResults.map((result, index) => (
              <div
                key={result.name}
                className="flex items-center justify-between mb-2"
              >
                <p className="font-medium">
                  <KeyCombinationLabel>Ctrl + {index + 1}</KeyCombinationLabel>
                  &nbsp;
                  <code>
                    {result.name}: {result.returnType}
                  </code>
                </p>

                <Button onClick={() => addFunction(result)}>Add</Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
