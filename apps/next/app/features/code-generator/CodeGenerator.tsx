"use client";
import React, { useEffect } from "react";
import { Button } from "@ui/button";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { useSavedFunctions } from "@/contexts/SavedFunctionsContext";
import { SortableBlockList } from "./SortableBlockList";
import { SaveDialog } from "./Dialogs";
import { CodeViewer } from "@/components/CodeViewer";
import { BlockEditor } from "@/components/editor";
import { useBlockEditor } from "@/contexts/BlockEditorContext";
import { CodebaseInfo } from "@ozhanefe/ts-codegenerator";

interface CodeGeneratorProps {
  codebaseInfo: CodebaseInfo;
}

export const CodeGenerator: React.FC<CodeGeneratorProps> = ({
  codebaseInfo,
}) => {
  const { state, setState, code, setCodebaseInfo } = useCodeGenerator();
  const { setCurrentBlock } = useBlockEditor();
  const { saveCurrentState } = useSavedFunctions();

  const isEmpty = state.blocks.length === 0;

  const handleSave = (name: string) => {
    saveCurrentState(name, state);
    navigator.clipboard.writeText(code);
  };

  const handleClear = () => {
    setState({
      blocks: [],
      variables: [],
      isAsync: false,
    });
    setCurrentBlock(null);
  };

  useEffect(() => {
    setCodebaseInfo(codebaseInfo);
  }, [codebaseInfo]);

  return (
    <section className="h-fit p-4 border border-gray-200 border-dashed rounded-md">
      <div>
        <BlockEditor />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1">
          <SortableBlockList />
        </div>
        <div className="col-span-1">
          <CodeViewer code={code} />
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
