import React, { useState, useCallback } from "react";
import { Button } from "@ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Input } from "@ui/input";
import { PlusCircle } from "lucide-react";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { useBlockEditor } from "@/contexts/BlockEditorContext";
import {
  CodeBlock,
  IfBlock,
  WhileLoopBlock,
  ElseIfBlock,
  ElseBlock,
  FunctionInfo,
} from "@ozhanefe/ts-codegenerator";
import { FunctionCombobox } from "@/components/editor/components/FunctionCombobox";
import { useImmerBlockUpdater } from "@/hooks/useImmerUpdaters";

type BlockType = CodeBlock["blockType"];

interface NestableBlockAdderProps {
  parentBlock?: IfBlock | WhileLoopBlock;
}

export const BlockAdder: React.FC<NestableBlockAdderProps> = ({
  parentBlock,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<BlockType | null>(null);
  const [condition, setCondition] = useState("");
  const { setState } = useCodeGenerator();
  const { setCurrentBlock, createFunctionInside } = useBlockEditor();
  const updateBlock = useImmerBlockUpdater();

  const createNewBlock = useCallback(
    (type: BlockType, condition: string, index: number): CodeBlock => {
      switch (type) {
        case "if":
          return {
            blockType: "if",
            condition,
            thenBlocks: [],
            elseIfBlocks: [],
            index,
          };
        case "while":
          return { blockType: "while", condition, loopBlocks: [], index };
        case "else-if":
          return { blockType: "else-if", condition, blocks: [], index };
        case "else":
          return { blockType: "else", blocks: [], index };
        default:
          throw new Error("Invalid block type");
      }
    },
    []
  );

  const handleAddBlock = useCallback(
    (newBlock: CodeBlock) => {
      setState((draft) => {
        if (!parentBlock) {
          draft.blocks.push(newBlock);
        } else {
          updateBlock(parentBlock.index, (block) => {
            if (block.blockType === "if") {
              if (newBlock.blockType === "else-if") {
                block.elseIfBlocks?.push(newBlock as ElseIfBlock);
              } else if (newBlock.blockType === "else") {
                block.elseBlock = newBlock as ElseBlock;
              } else {
                block.thenBlocks.push(newBlock);
              }
            } else if (block.blockType === "while") {
              block.loopBlocks.push(newBlock);
            }
          });
        }
        return draft;
      });

      setCurrentBlock(newBlock);
      setOpen(false);
      setSelectedType(null);
      setCondition("");
    },
    [parentBlock, setState, setCurrentBlock, updateBlock]
  );

  const handleAddControlBlock = useCallback(() => {
    if (!selectedType || selectedType === "functionCall") return;
    const newBlock = createNewBlock(selectedType, condition, -1); // Index will be set by state update
    handleAddBlock(newBlock);
  }, [selectedType, condition, createNewBlock, handleAddBlock]);

  const addFunction = (func: FunctionInfo) => {
    createFunctionInside(func);
  };

  const canAddElseIf = parentBlock?.blockType === "if";
  const canAddElse = parentBlock?.blockType === "if" && !parentBlock.elseBlock;

  return (
    <div className="flex space-x-2">
      <FunctionCombobox
        onSelect={addFunction}
        resetAfterSelect
        popoverText="Add a function"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            Add Block
            <PlusCircle className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-4">
          <div className="flex flex-col gap-y-2">
            <Button
              onClick={() => setSelectedType("if")}
              variant="outline"
              className="w-full"
            >
              If
            </Button>
            <Button
              onClick={() => setSelectedType("while")}
              variant="outline"
              className="w-full"
            >
              While
            </Button>
            <div className="flex space-x-2 items-center">
              {canAddElseIf && (
                <Button
                  onClick={() => setSelectedType("else-if")}
                  variant="outline"
                  className="w-full"
                >
                  Else If
                </Button>
              )}
              {canAddElse && (
                <Button
                  onClick={() => setSelectedType("else")}
                  variant="outline"
                  className="w-full"
                >
                  Else
                </Button>
              )}
            </div>
            <div className="flex space-x-2 items-center">
              {selectedType &&
                selectedType !== "else" &&
                selectedType !== "functionCall" && (
                  <Input
                    placeholder="Condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="flex-1"
                  />
                )}
            </div>
            {selectedType && selectedType !== "functionCall" && (
              <Button
                onClick={handleAddControlBlock}
                disabled={selectedType !== "else" && !condition}
                className="w-full"
              >
                Add Control Block
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
