import { Project, Node, Type, Symbol as TsSymbol } from "ts-morph";
import { FunctionInfo, TypeInfo, CodebaseInfo } from "./types";

export function scanCodebase(projectPath: string): CodebaseInfo {
  const project = new Project();
  project.addSourceFilesAtPaths(`${projectPath}/**/*.ts`);

  const codebaseInfo: CodebaseInfo = {
    functions: [],
    types: [],
  };

  // Filter out core project files (that are not in node_modules)
  const coreFiles = project
    .getSourceFiles()
    .filter((sourceFile) => !sourceFile.isInNodeModules());

  for (const sourceFile of coreFiles) {
    sourceFile.forEachDescendant((node) => {
      if (Node.isFunctionDeclaration(node)) {
        const functionInfo = getFunctionInfoFromNode(node);
        if (functionInfo) {
          codebaseInfo.functions.push(functionInfo);
        }
      } else if (
        Node.isVariableDeclaration(node) &&
        Node.isArrowFunction(node.getInitializer())
      ) {
        const arrowFunction = node.getInitializer();
        if (Node.isArrowFunction(arrowFunction)) {
          const functionInfo: FunctionInfo = {
            name: node.getName(),
            parameters: arrowFunction.getParameters().map((param) => ({
              name: param.getName(),
              type: param.getType().getText(),
            })),
            returnType: arrowFunction.getReturnType().getText(),
          };
          codebaseInfo.functions.push(functionInfo);
        }
      } else if (
        Node.isInterfaceDeclaration(node) ||
        Node.isClassDeclaration(node)
      ) {
        const typeInfo = getTypeInfoFromNode(node);
        if (typeInfo) {
          codebaseInfo.types.push(typeInfo);
        }
      }
    });
  }

  return codebaseInfo;
}

function getFunctionInfoFromNode(node: Node): FunctionInfo | null {
  if (Node.isFunctionDeclaration(node) || Node.isMethodDeclaration(node)) {
    return {
      name: node.getName() || "anonymous",
      parameters: node.getParameters().map((param) => ({
        name: param.getName(),
        type: param.getType().getText(),
      })),
      returnType: node.getReturnType().getText(),
    };
  }
  return null;
}

function getTypeInfoFromNode(node: Node): TypeInfo | null {
  if (Node.isInterfaceDeclaration(node) || Node.isClassDeclaration(node)) {
    const name = node.getName() || "Anonymous";
    const properties = node.getProperties().map((prop) => ({
      name: prop.getName(),
      type: prop.getType().getText(),
    }));

    const typeInfo: TypeInfo = { name, properties };

    if (Node.isClassDeclaration(node)) {
      typeInfo.extends = node.getExtends()?.getText()
        ? [node.getExtends()!.getText()]
        : undefined;
      typeInfo.implements = node.getImplements().map((impl) => impl.getText());
    }

    return typeInfo;
  }

  return null;
}
