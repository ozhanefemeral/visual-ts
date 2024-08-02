import { FunctionCallBlock, FunctionInfo } from "@ozhanefe/ts-codegenerator";
import React, { useState } from "react";
import { FunctionCombobox } from "../FunctionCombobox";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { Input } from "@ui/input";
import { Button } from "@ui/button";

export const FunctionEditor: React.FC<{ block: FunctionCallBlock }> = ({
  block,
}) => {
  const { setState } = useCodeGenerator();
  const [variableName, setVariableName] = useState<string>(
    block.returnVariable?.name
  );
  const { functionInfo } = block;

  // TODO:
  // just changing the function info is not enough
  // we need to update the variable name and other relevant fields
  // a utility function might be helpful as there will multiple fields to update
  const handleSelect = (selectedFunction: FunctionInfo) => {
    setState((state) => {
      if (state.blocks.map((b) => b.index).includes(block.index)) {
        const blocks = state.blocks.map((b) => {
          if (b.index === block.index) {
            return {
              ...b,
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
      <Input
        value={variableName}
        onChange={(e) => setVariableName(e.target.value)}
      />
      <Button onClick={handleRename}>Rename</Button>
    </React.Fragment>
  );
};
