import { FunctionInfo } from "@repo/parser";
import ts from "typescript";

export function createFunctionCall(
  functionInfo: FunctionInfo
): ts.CallExpression | ts.AwaitExpression {
  if (functionInfo.returnType?.includes("Promise")) {
    return ts.factory.createAwaitExpression(
      ts.factory.createCallExpression(
        ts.factory.createIdentifier(functionInfo.name),
        undefined,
        !!functionInfo.parameters && functionInfo.parameters.length > 0
          ? functionInfo.parameters.map((param) => {
              return ts.factory.createIdentifier(param.name);
            })
          : undefined
      )
    );
  }

  return ts.factory.createCallExpression(
    ts.factory.createIdentifier(functionInfo.name),
    undefined,
    !!functionInfo.parameters && functionInfo.parameters.length > 0
      ? functionInfo.parameters.map((param) => {
          return ts.factory.createIdentifier(param.name);
        })
      : undefined
  );
}

export function createVariableWithFunctionCall(
  functionInfo: FunctionInfo
): ts.VariableStatement {
  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(functionInfo.name.toLowerCase()),
          undefined,
          undefined,
          createFunctionCall(functionInfo)
        ),
      ],
      ts.NodeFlags.Const
    )
  );
}

export function generateCode(functionInfos: FunctionInfo[]): string {
  let code = "";

  const functionName = "generatedFunction";
  const isAsync = functionInfos.some((f) => f.returnType?.includes("Promise"));

  const functionDeclaration = ts.factory.createFunctionDeclaration(
    isAsync
      ? [ts.factory.createModifier(ts.SyntaxKind.AsyncKeyword)]
      : undefined, //modifiers
    undefined, //asteriskToken
    functionName, //name
    undefined, //typeParameters
    [], //parameters
    undefined, //type
    ts.factory.createBlock([
      ...functionInfos.map(createVariableWithFunctionCall),
    ])
  );

  code += ts
    .createPrinter()
    .printNode(
      ts.EmitHint.Unspecified,
      functionDeclaration,
      ts.createSourceFile("temp.ts", "", ts.ScriptTarget.Latest)
    );

  return code;
}
