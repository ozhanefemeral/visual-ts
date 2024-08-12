import React, { useState } from "react";
import {
  findAndUpdateBlock,
  FunctionCallBlock,
  FunctionInfo,
} from "@ozhanefe/ts-codegenerator";
import { FunctionCombobox } from "./components/FunctionCombobox";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { Input } from "@ui/input";
import { Separator } from "@ui/separator";

export const FunctionEditor: React.FC<{ block: FunctionCallBlock }> = ({
  block,
}) => {
  const { setState } = useCodeGenerator();
  const [variableName, setVariableName] = useState<string>(
    block.returnVariable?.name
  );
  const { functionInfo } = block;

  const handleSelect = (selectedFunction: FunctionInfo) => {
    setState((state) => {
      if (state.blocks.map((b) => b.index).includes(block.index)) {
        const blocks = state.blocks.map((b) => {
          if (b.index === block.index) {
            return {
              ...b,
              returnVariable: {
                name: variableName,
                type: selectedFunction.returnType,
              },
              functionInfo: selectedFunction,
            };
          }
          return b;
        });
        return {
          ...state,
          blocks,
        };
      }
      return state;
    });
  };

  const handleRename = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setState((state) => ({
      ...state,
      blocks: findAndUpdateBlock(state.blocks, block.index, (b) => ({
        ...b,
        returnVariable: {
          name,
          type: functionInfo.returnType,
        },
        functionInfo: {
          ...functionInfo,
          returnVariable: {
            name,
            type: functionInfo.returnType,
          },
        },
      })),
    }));

    setVariableName(event.target.value);
  };

  return (
    <React.Fragment>
      <FunctionCombobox onSelect={handleSelect} />
      <Separator orientation="vertical" />
      <div>
        <Input value={variableName} onChange={handleRename} />
      </div>
      <Separator orientation="vertical" />
    </React.Fragment>
  );
};
