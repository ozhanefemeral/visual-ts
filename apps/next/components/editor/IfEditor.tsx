import { useBlockEditor } from "@/contexts/BlockEditorContext";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { FunctionInfo, IfBlock } from "@ozhanefe/ts-codegenerator";
import { Input } from "@ui/input";
import React from "react";
import { FunctionCombobox } from "../FunctionCombobox";
import { Separator } from "@ui/separator";

export const IfEditor: React.FC<{ block: IfBlock }> = ({ block }) => {
  const condition = block.condition;
  const { setState } = useCodeGenerator();
  const { createFunctionInside } = useBlockEditor();

  const handleConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => {
      if (state.blocks.map((b) => b.index).includes(block.index)) {
        const blocks = state.blocks.map((b) => {
          if (b.index === block.index) {
            return {
              ...b,
              condition: event.target.value,
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

  const addFunction = (func: FunctionInfo) => {
    createFunctionInside(func);
  };

  return (
    <React.Fragment>
      <FunctionCombobox onSelect={addFunction} resetAfterSelect />
      <Separator orientation="vertical" />
      <div>
        <Input defaultValue={condition} onChange={handleConditionChange} />
      </div>
    </React.Fragment>
  );
};
