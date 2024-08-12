import React, { useState, useCallback } from "react";
import { FunctionCallBlock, FunctionInfo } from "@ozhanefe/ts-codegenerator";
import { FunctionCombobox } from "./components/FunctionCombobox";
import { Input } from "@ui/input";
import { Separator } from "@ui/separator";
import { useFunctionBlockUpdater } from "@/hooks/useImmerUpdaters";

export const FunctionEditor: React.FC<{ block: FunctionCallBlock }> = ({
  block,
}) => {
  const [variableName, setVariableName] = useState(
    block.returnVariable?.name || ""
  );
  const updateFunctionBlock = useFunctionBlockUpdater();

  const handleSelect = useCallback(
    (selectedFunction: FunctionInfo) => {
      updateFunctionBlock(block, (draft) => {
        draft.functionInfo = selectedFunction;
        draft.returnVariable = {
          name: variableName,
          type: selectedFunction.returnType,
        };
      });
    },
    [block, updateFunctionBlock, variableName]
  );

  const handleRename = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newName = event.target.value;
      updateFunctionBlock(block, (draft) => {
        draft.returnVariable.name = newName;
        if (draft.functionInfo.returnVariable) {
          draft.functionInfo.returnVariable.name = newName;
        }
      });
      setVariableName(newName);
    },
    [block, updateFunctionBlock]
  );

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
