import { functionCallBlockToTypeScript } from "./blocks/function-call";
import { CodeBlock, VariableInfoWithIndex } from "types";
import { CodeGeneratorState } from "types/generator";
import { Statement } from "typescript";

export function blockToTypeScript(
  block: CodeBlock,
  state: CodeGeneratorState | { variables: VariableInfoWithIndex[] }
): Statement {
  switch (block.blockType) {
    case "functionCall":
      return functionCallBlockToTypeScript(block, state);

    default:
      throw new Error(`Unknown block type: ${block.blockType}`);
  }
}
