import { ScrollArea } from "@ui/scroll-area";
import { CodeViewer } from "./CodeViewer";

import { ModuleTypes } from "./ModuleTypes";
import { TypeSpan } from "./ModuleTypes/TypeBadge";
import {
  FileParserProps,
  FunctionInfo,
  ModuleInfoFields,
} from "@parser/module-parser/types";
import { updateInterfaces } from "@parser/component-parser/utils";
import { parseFunctionsFromFile } from "@parser/module-parser";
import { readFileContent, getFileName } from "@parser/utils/file-utils";

export function getModuleInfo({ filePath }: FileParserProps): ModuleInfoFields {
  const fileContent = readFileContent(filePath);
  const fileName = getFileName(filePath);
  const interfaces: string[] = [];

  const { functionsInfo: functions, usedTypes } =
    parseFunctionsFromFile(filePath);

  for (const line of fileContent.split("\n")) {
    updateInterfaces(line, interfaces);
  }

  return { fileName, interfaces, functions, fileContent, usedTypes };
}

interface FunctionCardProps extends FunctionInfo {
  key: string;
}

const FunctionCard: React.FC<FunctionCardProps> = ({
  name,
  returnType,
  parameters,
  jsDocComment,
  variables,
}) => {
  const hasParameters = parameters && parameters.length > 0;
  const hasVariables = variables && variables.length > 0;

  return (
    <div className="bg-gray-100 rounded-md p-4">
      <h4 className="text-sm font-semibold">
        {name}(
        {hasParameters &&
          parameters.map((param) => `${param.name}: ${param.type}`).join(", ")}
        ): <TypeSpan type={returnType || "void"} />
      </h4>
      {jsDocComment && (
        <p className="text-sm text-gray-600 mt-2">{jsDocComment.toString()}</p>
      )}
      <p className="text-sm text-gray-600 mt-2">
        {hasVariables && "Variables: "}
        {hasVariables &&
          variables
            .map((variable) => `${variable.name}: ${variable.type}`)
            .join(", ")}
      </p>
    </div>
  );
};

interface ModuleFunctionsProps {
  functions: FunctionInfo[];
}

const ModuleFunctions: React.FC<ModuleFunctionsProps> = ({ functions }) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Functions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {functions.map((func, index) => (
          <FunctionCard key={`function-${index}`} {...func} />
        ))}
      </div>
    </div>
  );
};

export const ModuleInfo: React.FC<FileParserProps> = ({ filePath }) => {
  const moduleInfo = getModuleInfo({ filePath });

  return (
    <section className="flex gap-x-8">
      <div className="w-full md:w-2/3">
        <ModuleFunctions functions={moduleInfo.functions} />
        <ModuleTypes types={moduleInfo.interfaces} />
      </div>
      <div className=" w-full md:w-1/3">
        <h3 className="text-lg font-bold mb-4">File Content</h3>
        <ScrollArea className="h-72 rounded-md">
          <CodeViewer fileContent={moduleInfo.fileContent} />
        </ScrollArea>
      </div>
    </section>
  );
};
