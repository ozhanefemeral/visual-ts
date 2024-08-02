"use client";

import { useBlockEditor } from "@/contexts/BlockEditorContext";
import { FunctionEditor } from "./FunctionEditor";
import { IfEditor } from "./IfEditor";
import { WhileEditor } from "./WhileEditor";

export const BlockEditor = () => {
  const { currentBlock } = useBlockEditor();

  if (!currentBlock) return <EmptyBlockEditor />;

  return (
    <div className="flex justify-start w-full pb-4 gap-x-4">
      {currentBlock.blockType === "functionCall" && (
        <FunctionEditor block={currentBlock} />
      )}
      {currentBlock.blockType === "if" && <IfEditor block={currentBlock} />}
      {currentBlock.blockType === "while" && (
        <WhileEditor block={currentBlock} />
      )}
    </div>
  );
};

const EmptyBlockEditor = () => {
  return (
    <div className="pb-4">
      <p>Select a block to edit</p>
    </div>
  );
};
