import React, { useState, useEffect } from "react";
import { FunctionInfo, SearchResult } from "@repo/parser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { Button } from "@ui/button";

interface SearchDialogProps {
  onAddFunction: (functionInfo: FunctionInfo) => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ onAddFunction }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (
        open &&
        event.altKey &&
        (event.metaKey || event.ctrlKey) &&
        event.key >= "1" &&
        event.key <= "9"
      ) {
        event.preventDefault();
        const index = parseInt(event.key) - 1;
        if (
          index < searchResults.length &&
          !!searchResults[index].functionInfo
        ) {
          onAddFunction(searchResults[index].functionInfo);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, searchResults, onAddFunction]);

  useEffect(() => {
    const search = async () => {
      if (searchQuery) {
        setIsLoading(true);
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`
        );
        const results = await response.json();
        setSearchResults(
          results.filter((result: any) => result.type === "function")
        );
        setIsLoading(false);
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

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
          {isLoading ? (
            <p className="text-center text-gray-500">Searching the matrix...</p>
          ) : searchQuery === "" ? (
            <p className="text-center text-gray-500">
              Type to search, or don't. I'm a dialog, not a cop.
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
                <div className="py-2">
                  <p className="font-medium">
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
                      ⌘ + ⌥ + {index + 1}
                    </kbd>{" "}
                    {result.name}
                  </p>
                  <p className="pt-2 text-sm text-gray-500">
                    {result.filePath}
                  </p>
                </div>
                {!!result.functionInfo && (
                  <Button onClick={() => onAddFunction(result.functionInfo!)}>
                    Add
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
