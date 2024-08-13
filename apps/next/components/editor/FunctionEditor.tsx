import { FunctionCallBlock, FunctionInfo } from "@ozhanefe/ts-codegenerator";
import React, { useState } from "react";
import { FunctionCombobox } from "./components/FunctionCombobox";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
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

  const handleRename = () => {
    setState((state) => {
      if (state.blocks.map((b) => b.index).includes(block.index)) {
        const blocks = state.blocks.map((b) => {
          if (b.index === block.index) {
            return {
              ...b,
              returnVariable: {
                name: variableName,
                type: functionInfo.returnType,
              },
              variableName: variableName,
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

  return (
    <React.Fragment>
      <FunctionCombobox onSelect={handleSelect} />
      <Separator orientation="vertical" />
      <div className="flex gap-x-2">
        <Input
          value={variableName}
          onChange={(e) => setVariableName(e.target.value)}
        />
        <Button onClick={handleRename}>Rename</Button>
      </div>
      <Separator orientation="vertical" />
    </React.Fragment>
  );
};
