import { getModuleInfo } from "@parser/components/file-parser/ModuleInfo";
import { FunctionList } from "./FunctionList";

export const ProjectFunctions = () => {
  const moduleFiles = ["app/actions.ts"];

  const mergedFunctions = moduleFiles
    .map((filePath) => {
      const moduleInfo = getModuleInfo({ filePath });
      return moduleInfo.functions;
    })
    .flat();

  return (
    <div>
      <h1 className="text-2xl font-bold pb-4">Project Functions</h1>
      <div className="flex flex-col gap-y-4">
        <FunctionList functions={mergedFunctions} />
      </div>
    </div>
  );
};
