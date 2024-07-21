export * from "./module-parser";
export {
  createFunctionCall,
  createVariableWithFunctionCall,
  extractVariables,
  generateCode,
} from "./functions";

export type {
  VariableInfoWithIndex,
  CodebaseInfo,
  FileParserProps,
  FunctionInfo,
  ModuleInfoFields,
  TypeInfo,
  VariableInfo,
} from "./types";

export { scanCodebase } from "./codebase-scanner";
