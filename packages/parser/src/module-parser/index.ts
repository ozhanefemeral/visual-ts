import * as ts from "typescript";
import { FunctionInfo } from "./types";
import { getFunctionVariables } from "./utils";

export function parseFunctionsFromFile(filePath: string) {
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
  };
  const program = ts.createProgram([filePath], compilerOptions);
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) {
    throw new Error("Source file not found");
  }
  const typeChecker = program.getTypeChecker();
  const functionsInfo: Array<FunctionInfo> = [];
  const usedTypes: Array<string> = [];

  function visit(node: ts.Node) {
    if (ts.isFunctionDeclaration(node) && node.name) {
      const name = node.name.text;
      const returnType = node.type
        ? typeChecker.typeToString(typeChecker.getTypeFromTypeNode(node.type))
        : "void";
      const parameters = node.parameters.map((parameter) => {
        const parameterName = parameter.name.getText(sourceFile);
        const parameterType = parameter.type
          ? typeChecker.typeToString(
              typeChecker.getTypeFromTypeNode(parameter.type)
            )
          : "any";
        return { name: parameterName, type: parameterType };
      });
      const jsDocComment = ts.getJSDocCommentsAndTags(node)[0]?.comment;
      // const variables;
      const functionInfo: FunctionInfo = {
        name,
        returnType,
        parameters,
        jsDocComment: jsDocComment?.toString(),
        code: node.getText(),
        variables: getFunctionVariables(sourceFile!, name),
      };

      // Traverse the function body to find used variables
      const visitFunctionBody = function (node: ts.Node) {
        if (ts.isIdentifier(node)) {
          const variableName = node.text;
          usedTypes.push(variableName);
        }
        ts.forEachChild(node, visitFunctionBody);
      };
      ts.forEachChild(node.body!, visitFunctionBody);

      functionsInfo.push(functionInfo);
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return { functionsInfo, usedTypes };
}
