import { FunctionInfo, VariableInfo } from "./common";

export interface Block {
  index: number;
  comment?: string;
  blockType: string;
}

export interface FunctionCallBlock extends Block {
  functionInfo: FunctionInfo;
  parameters?: VariableInfo[];
  returnVariable?: VariableInfo;
  isAsync: boolean;
  blockType: "functionCall";
}

// Add more block types as implemented
export type CodeBlock = FunctionCallBlock;
