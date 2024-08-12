import React, { useState } from "react";
import { WhileLoopBlock } from "@ozhanefe/ts-codegenerator";
import { Input } from "@ui/input";
import { Separator } from "@ui/separator";
import { BlockAdder } from "./components/BlockAdder";
import { useWhileBlockUpdater } from "@/hooks/useImmerUpdaters";

export const WhileEditor: React.FC<{ block: WhileLoopBlock }> = ({ block }) => {
  const [conditionInput, setConditionInput] = useState(block.condition);
  const updateWhileBlock = useWhileBlockUpdater();

  const handleConditionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCondition = event.target.value;
    updateWhileBlock(block, (draft) => {
      draft.condition = newCondition;
    });
    setConditionInput(newCondition);
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
