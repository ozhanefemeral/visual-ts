import type { VariableInfo } from "./module-parser";

export interface VariableInfoWithIndex extends VariableInfo {
  index: number;
}
