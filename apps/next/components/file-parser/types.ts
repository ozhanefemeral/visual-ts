import { JSDocComment, NodeArray } from "typescript";

export interface FunctionInfo {
  name: string;
  returnType: string;
  functionCalls?: Map<string, number>;
  parameters?: ParameterInfo[];
  jsDocComment?: string | undefined;
  variables?: VariableInfo[];
  code?: string;
}

export interface VariableInfo {
  name: string;
  type: string;
  jsDocComment?: string | NodeArray<JSDocComment>;
}

export interface ParameterInfo {
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

export interface ComponentInfoFields {
  fileName: string;
  stateVariables: string[];
  functions: FunctionInfo[];
  buttons: { label: string; handler: string }[];
}

export interface FileParserProps {
  filePath: string;
}
