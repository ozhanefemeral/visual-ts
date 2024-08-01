import { FunctionCallBlock } from "@ozhanefe/ts-codegenerator";

export const FunctionEditor: React.FC<{ block: FunctionCallBlock }> = ({
  block,
}) => {
  const { functionInfo } = block;
  return (
    <div className="">
      Editing: <span className="font-bold">{functionInfo.name}</span>
    </div>
  );
};
