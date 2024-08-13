import React, { useEffect, useState } from "react";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { WhileLoopBlock } from "@ozhanefe/ts-codegenerator";
import { Input } from "@ui/input";
import { Separator } from "@ui/separator";
import { BlockAdder } from "./components/BlockAdder";

export const WhileEditor: React.FC<{ block: WhileLoopBlock }> = ({ block }) => {
  const { setState } = useCodeGenerator();
  const [conditionInput, setConditionInput] = useState(block.condition);

  useEffect(() => {
    setConditionInput(block.condition);
  }, [block.condition]);

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

    setConditionInput(event.target.value);
  };

  return (
    <React.Fragment>
      <BlockAdder parentBlock={block} />
      <Separator orientation="vertical" />
      <div>
        <Input value={conditionInput} onChange={handleConditionChange} />
      </div>
      <Separator orientation="vertical" />
    </React.Fragment>
  );
};
