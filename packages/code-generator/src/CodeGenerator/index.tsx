"use client";
import React from "react";
import { CodeViewer } from "@parser/components/file-parser/CodeViewer";
import { Button } from "@ui/button";
import { useCodeGenerator } from "./context";
import { useSavedFunctions } from "./saved-functions.context";
import SearchDialog from "@parser/components/shared/SearchDialog";
import { SortableFunctionList } from "./SortableFunctionList";
import { SaveDialog, LoadDialog, HelpDialog } from "./CodeGeneratorDialogs";

export const CodeGenerator: React.FC = () => {
  const { functions, setFunctions, variables, setVariables, code } =
    useCodeGenerator();
  const { saveCurrentState } = useSavedFunctions();

  const isEmpty = functions.length === 0;
  const outputWithBreakLine = code.replace(/;/g, ";\n").replace(/{/g, "{\n");

  const handleSave = (name: string) => {
    saveCurrentState(name, functions, variables);
    navigator.clipboard.writeText(outputWithBreakLine);
  };

  const handleLoad = (state: {
    name: string;
    functions: typeof functions;
    variables: typeof variables;
  }) => {
    setFunctions(state.functions);
    setVariables(state.variables);
  };

  return (
    <section className="h-fit p-4 border border-gray-200 border-dashed rounded-md">
      <h1 className="text-2xl font-bold pb-4">Code Generator</h1>
      <div className="flex gap-4 mb-4">
        <SearchDialog
          onAddFunction={(func) => setFunctions([...functions, func])}
        />
        <LoadDialog onLoad={handleLoad} />
        <HelpDialog />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1">
          <SortableFunctionList />
        </div>
        <div className="col-span-1">
          <CodeViewer fileContent={outputWithBreakLine} />
        </div>
        <div className="col-span-2 mt-auto flex justify-end gap-x-4 items-end">
          <SaveDialog onSave={handleSave} isEmpty={isEmpty} />
          <Button
            variant="destructive"
            onClick={() => setFunctions([])}
            disabled={isEmpty}
          >
            Clear
          </Button>
        </div>
      </div>
    </section>
  );
};
