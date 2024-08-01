import { WhileLoopBlock } from "@ozhanefe/ts-codegenerator";

export const WhileEditor: React.FC<{ block: WhileLoopBlock }> = ({ block }) => {
  return (
    <div className="">
      Editing: <span className="font-bold">while({block.condition})</span>
    </div>
  );
};
