import React, { useEffect, useState } from "react";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { IfBlock, findAndUpdateBlock } from "@ozhanefe/ts-codegenerator";
import { Input } from "@ui/input";
import { Separator } from "@ui/separator";
import { BlockAdder } from "./components/BlockAdder";

export const IfEditor: React.FC<{ block: IfBlock }> = ({ block }) => {
  const { setState } = useCodeGenerator();
  const [conditionInput, setConditionInput] = useState(block.condition);

  useEffect(() => {
    setConditionInput(block.condition);
  }, [block.condition]);

  const handleConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      blocks: findAndUpdateBlock(state.blocks, block.index, (b) => ({
        ...b,
        condition: event.target.value,
      })),
    }));

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
