"use client";

import { useBlockEditor } from "@/contexts/BlockEditorContext";
import { FunctionEditor } from "./FunctionEditor";
import { IfEditor } from "./IfEditor";
import { WhileEditor } from "./WhileEditor";
import { BlockAdder } from "./components/NestableBlockAdder";
import { Button } from "@ui/button";
import { XCircleIcon } from "lucide-react";

export const BlockEditor = () => {
  const { currentBlock, setCurrentBlock } = useBlockEditor();

  if (!currentBlock) return <EmptyBlockEditor />;

  return (
    <div className="flex justify-start w-full pb-4 gap-x-4 relative">
      {currentBlock.blockType === "functionCall" && (
        <FunctionEditor block={currentBlock} />
      )}
      {currentBlock.blockType === "if" && <IfEditor block={currentBlock} />}
      {currentBlock.blockType === "while" && (
        <WhileEditor block={currentBlock} />
      )}
      <Button
        variant="secondary"
        onClick={() => setCurrentBlock(null)}
        className="absolute right-0 top-0"
      >
        <XCircleIcon className="h-6 w-6 mr-2" />
        Clear Selection
      </Button>
    </div>
  );
};

const EmptyBlockEditor = () => {
  return (
    <div className="pb-4">
      <BlockAdder />
    </div>
  );
};
