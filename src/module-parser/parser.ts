import { Node, Project } from "ts-morph";
import type { FunctionInfo } from "./types";
import { getFunctionVariables } from "./utils";

export function getFunctionInfoFromNode(node: Node): FunctionInfo | null {
  if (Node.isFunctionDeclaration(node)) {
    const name = node.getName() || "anonymous";
    const returnType = node.getReturnType().getText();
    const parameters = node.getParameters().map((param) => ({
      name: param.getName(),
      type: param.getType().getText(),
    }));
    const jsDocComment = node.getJsDocs()[0]?.getDescription();

    const functionInfo: FunctionInfo = {
      name,
      returnType,
      parameters,
      jsDocComment,
      code: node.getText(),
      variables: getFunctionVariables(node.getSourceFile(), name),
    };

    return functionInfo;
  }

  return null;
}

export function parseFunctionsFromFile(filePath: string) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);
  const functionsInfo: Array<FunctionInfo> = [];
  const usedTypes: Array<string> = [];

  function visit(node: Node) {
    const functionInfo = getFunctionInfoFromNode(node);
    if (functionInfo) {
      functionsInfo.push(functionInfo);

      // Traverse the function body to find used variables
      node.forEachDescendant((descendant) => {
        if (Node.isIdentifier(descendant)) {
          const variableName = descendant.getText();
          usedTypes.push(variableName);
        }
      });
    }

    node.forEachChild(visit);
  }

  visit(sourceFile);

  return { functionsInfo, usedTypes };
}
