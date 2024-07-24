import { FunctionInfo, TypeInfo } from "types";

export interface CodebaseInfo {
  functions: FunctionInfo[];
  types: TypeInfo[];
}

export interface ModuleInfoFields {
  fileName: string;
  interfaces: string[];
  functions: FunctionInfo[];
  fileContent: string;
  usedTypes: string[];
}
