export interface VariableInfo {
  name: string;
  type: string;
}

export interface FunctionInfo {
  name: string;
  returnType: string;
  jsDocComment?: string;
  code?: string;
  variables?: VariableInfo[];
  returnVariable?: VariableInfo;
  parameters?: VariableInfo[];
}

export interface VariableInfoWithIndex extends VariableInfo {
  index: number;
}

// Type-related info
export interface TypeInfo {
  name: string;
  properties?: Array<{ name: string; type: string }>;
  methods?: Array<FunctionInfo>;
  extends?: string[];
  implements?: string[];
}
