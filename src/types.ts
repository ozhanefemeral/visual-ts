export interface TypeInfo {
  name: string;
  properties?: Array<{ name: string; type: string }>;
  methods?: Array<FunctionInfo>;
  extends?: string[];
  implements?: string[];
}

export interface CodebaseInfo {
  functions: FunctionInfo[];
  types: TypeInfo[];
}

export interface FunctionInfo {
  name: string;
  returnType: string;
  parameters?: { name: string; type: string }[];
  jsDocComment?: string;
  code?: string;
  variables?: VariableInfo[];
}

export interface VariableInfo {
  name: string;
  type: string;
}

export interface ModuleInfoFields {
  fileName: string;
  interfaces: string[];
  functions: FunctionInfo[];
  fileContent: string;
  usedTypes: string[];
}

export interface FileParserProps {
  filePath: string;
}

export interface VariableInfoWithIndex extends VariableInfo {
  index: number;
}
