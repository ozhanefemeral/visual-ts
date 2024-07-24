import { Node, Project } from "ts-morph";
import type { FunctionInfo } from "../types";
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

export function parseFunctionsFromText(sourceCode: string): {
  functionsInfo: FunctionInfo[];
  usedTypes: string[];
} {
  const project = new Project();
  const sourceFile = project.createSourceFile("temp.ts", sourceCode);

  const functionsInfo: FunctionInfo[] = [];
  const usedTypes: string[] = [];

  sourceFile.forEachDescendant((node) => {
    const functionInfo = getFunctionInfoFromNode(node);
    if (functionInfo) {
      functionsInfo.push(functionInfo);
      // Extract used types from function info
      if (functionInfo.returnType) usedTypes.push(functionInfo.returnType);
      functionInfo.parameters?.forEach((param) => usedTypes.push(param.type));
    }
  });

  return { functionsInfo, usedTypes };
}
