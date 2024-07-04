"use client";
import React, { useState, useEffect } from "react";
import { SearchResult } from "@repo/parser";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@ui/dialog";
import { Input } from "@ui/input";
import { Separator } from "@ui/separator";

const SearchDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (searchQuery) {
        setIsLoading(true);
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery)}`
        );
        const results = await response.json();
        setSearchResults(results);
        setIsLoading(false);
      } else {
        setSearchResults([]);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const groupedResults = searchResults.reduce(
    (acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<string, SearchResult[]>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Codebase</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search for functions, components, types..."
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
            Object.entries(groupedResults).map(([type, results]) => (
              <div key={type} className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-2 capitalize">
                  {type}s
                </h3>
                {results.map((result, index) => (
                  <React.Fragment key={result.name}>
                    <div className="py-2">
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-gray-500">{result.filePath}</p>
                    </div>
                    {index < results.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
