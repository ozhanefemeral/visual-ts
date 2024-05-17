import * as ts from "typescript";
import { VariableInfo } from "./types";

function parseVariables(node: ts.Node): VariableInfo[] {
  const variables: VariableInfo[] = [];

  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node)) {
      if (node.name && ts.isIdentifier(node.name)) {
        const name = node.name.text;
        const type = node.type ? node.type.getText() : "any";
        variables.push({ name, type });
      }
    } else {
      ts.forEachChild(node, visit);
    }
  }

  visit(node);
  return variables;
}

export function getFunctionVariables(
  sourceFile: ts.SourceFile,
  functionName: string
): VariableInfo[] | undefined {
  let variables: VariableInfo[] | undefined;

  function visit(node: ts.Node) {
    if (
      ts.isFunctionDeclaration(node) &&
      node.name &&
      node.name.text === functionName
    ) {
      variables = parseVariables(node);
    } else if (
      ts.isFunctionExpression(node) &&
      node.name &&
      node.name.text === functionName
    ) {
      variables = parseVariables(node);
    } else {
      ts.forEachChild(node, visit);
    }
  }

  visit(sourceFile);
  return variables;
}
