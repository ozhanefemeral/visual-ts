import { FunctionInfo } from "#module-parser/types";
export interface ButtonInfo {
  label: string;
  handler: string;
}

export interface ComponentInfoFields {
  fileName: string;
  stateVariables: string[];
  functions: FunctionInfo[];
  buttons: { label: string; handler: string }[];
}
