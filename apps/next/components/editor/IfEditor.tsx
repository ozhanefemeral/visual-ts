import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { IfBlock } from "@ozhanefe/ts-codegenerator";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import React, { useState } from "react";

export const IfEditor: React.FC<{ block: IfBlock }> = ({ block }) => {
  const condition = block.condition;
  const [conditionInput, setConditionInput] = useState(condition);
  const { setState } = useCodeGenerator();

  const handleConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConditionInput(event.target.value);
  };

  const handleConditionSubmit = () => {
    setState((state) => {
      if (state.blocks.map((b) => b.index).includes(block.index)) {
        const blocks = state.blocks.map((b) => {
          if (b.index === block.index) {
            return {
              ...b,
              condition: conditionInput,
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
      <Input value={conditionInput} onChange={handleConditionChange} />
      <Button onClick={handleConditionSubmit}>Update</Button>
    </React.Fragment>
  );
};
