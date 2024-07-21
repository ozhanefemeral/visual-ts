import { Node, SourceFile } from "ts-morph";
import type { VariableInfo } from "../types";

function parseVariables(node: Node): VariableInfo[] {
  const variables: VariableInfo[] = [];

  node.forEachDescendant((descendant) => {
    if (Node.isVariableDeclaration(descendant)) {
      const name = descendant.getName();
      const type = descendant.getType().getText();
      variables.push({ name, type });
    }
  });

  return variables;
}

export function getFunctionVariables(
  sourceFile: SourceFile,
  functionName: string
): VariableInfo[] | undefined {
  const functionNode =
    sourceFile.getFunction(functionName) ||
    sourceFile.getFirstDescendant(
      (node) =>
        Node.isFunctionExpression(node) && node.getName() === functionName
    );

  if (functionNode) {
    return parseVariables(functionNode);
  }

  return undefined;
}
