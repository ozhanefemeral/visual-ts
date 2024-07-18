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
