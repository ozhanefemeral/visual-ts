"use client";
import React from "react";
import { Button } from "@ui/button";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { useSavedFunctions } from "@/contexts/SavedFunctionsContext";
import { SortableBlockList } from "./SortableBlockList";
import { SaveDialog } from "./Dialogs";
import { CodeViewer } from "@/components/CodeViewer";

export const CodeGenerator: React.FC = () => {
  const { state, setState, code } = useCodeGenerator();
  const { saveCurrentState } = useSavedFunctions();

  const isEmpty = state.blocks.length === 0;
  const outputWithBreakLine = code.replace(/;/g, ";\n").replace(/{/g, "{\n");

  const handleSave = (name: string) => {
    saveCurrentState(name, state);
    navigator.clipboard.writeText(outputWithBreakLine);
  };

  const handleClear = () => {
    setState({
      blocks: [],
      variables: [],
      isAsync: false
    });
  };

  return (
    <section className="h-fit p-4 border border-gray-200 border-dashed rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1">
          <SortableBlockList />
        </div>
        <div className="col-span-1">
          <CodeViewer code={outputWithBreakLine} />
        </div>
        <div className="col-span-2 mt-auto flex justify-end gap-x-4 items-end">
          <SaveDialog onSave={handleSave} isEmpty={isEmpty} />
          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={isEmpty}
          >
            Clear
          </Button>
        </div>
      </div>
    </section>
  );
};