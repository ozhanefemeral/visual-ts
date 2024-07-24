import { VariableInfo } from "./common";

export interface Block {
  index: number;
  comment?: string;
}

export interface FunctionCallBlock extends Block {
  type: string;
  functionName: string;
  parameters?: VariableInfo[];
  returnVariable?: VariableInfo;
  isAsync: boolean;
}

// Add more block types as implemented
export type CodeBlock = FunctionCallBlock;
