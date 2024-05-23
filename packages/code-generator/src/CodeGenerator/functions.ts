import { FunctionInfo } from "@parser/module-parser/types";

export function generateCodeFromFunction(
  functionInfo: FunctionInfo,
  existingCode: string
): string {
  let code = "";

  const variableName = functionInfo.name.toLowerCase();
  const parameters = functionInfo.parameters;
  const isAsync = functionInfo.returnType?.includes("Promise");

  code += `let ${variableName} = ${isAsync ? "await" : ""} ${functionInfo.name}(`;

  code += ");";

  return code;
}

export function generateCode(functionInfos: FunctionInfo[]): string {
  let code = "";

  code += `function generatedFunction() { \n`;

  const isAsync = functionInfos.some((f) => f.returnType?.includes("Promise"));

  if (isAsync) {
    code = `async ${code}`;
  }

  for (const functionInfo of functionInfos) {
    code += generateCodeFromFunction(functionInfo, code) + "\n";
  }

  code += `} \n`;
  return code;
}
