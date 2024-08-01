import { IfBlock } from "@ozhanefe/ts-codegenerator";

export const IfEditor: React.FC<{ block: IfBlock }> = ({ block }) => {
  return (
    <div className="">
      Editing: <span className="font-bold">if({block.condition})</span>
    </div>
  );
};
