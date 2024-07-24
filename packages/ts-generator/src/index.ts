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
  FunctionInfo,
  ModuleInfoFields,
  TypeInfo,
  VariableInfo,
  Block,
  FunctionCallBlock,
} from "./types";

export { scanCodebase } from "./codebase-scanner";

export type { NextCodebaseInfo, ServerActionInfo } from "./nextjs";
export { scanNextjsCodebase, generateServerAction } from "./nextjs";
export * as NextJS from "./nextjs";
