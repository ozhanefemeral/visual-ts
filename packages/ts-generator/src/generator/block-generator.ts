import { createVariableWithFunctionCall } from "./blocks/function-call";
import { CodeBlock, VariableInfoWithIndex } from "types";
import { Statement } from "typescript";

export function blockToTypeScript(
  block: CodeBlock,
  variables: VariableInfoWithIndex[]
): Statement {
  switch (block.blockType) {
    case "functionCall":
      return createVariableWithFunctionCall(block, variables);

    default:
      throw new Error(`Unknown block type: ${block.blockType}`);
  }
}
