import { CodeBlock } from "./blocks";
import { VariableInfoWithIndex } from "./common";

export interface CodeGeneratorState {
  blocks: CodeBlock[];
  variables: VariableInfoWithIndex[];
  isAsync: boolean;
}
