import { FunctionInfo, VariableInfo } from "@repo/parser";
import ts from "typescript";

export interface VariableInfoWithIndex extends VariableInfo {
  index: number;
}

export function createFunctionCall(
  functionInfo: FunctionInfo
): ts.CallExpression | ts.AwaitExpression {
  if (functionInfo.returnType?.includes("Promise")) {
    return ts.factory.createAwaitExpression(
      ts.factory.createCallExpression(
        ts.factory.createIdentifier(functionInfo.name),
        undefined,
        functionInfo.parameters?.map((param) =>
          ts.factory.createIdentifier(param.name)
        ) || []
      )
    );
  }

  return ts.factory.createCallExpression(
    ts.factory.createIdentifier(functionInfo.name),
    undefined,
    functionInfo.parameters?.map((param) =>
      ts.factory.createIdentifier(param.name)
    ) || []
  );
}

export function createVariableWithFunctionCall(
  functionInfo: FunctionInfo,
  index: number
): ts.VariableStatement {
  const variableInfo: VariableInfoWithIndex = {
    name: functionInfo.name.toLowerCase(),
    type: functionInfo.returnType || "any",
    index,
  };

  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(variableInfo.name),
          undefined,
          undefined,
          createFunctionCall(functionInfo)
        ),
      ],
      ts.NodeFlags.Const
    )
  );
}

export function extractVariables(
  functionInfos: FunctionInfo[]
): VariableInfoWithIndex[] {
  return functionInfos.map((func, index) => {
    const type = func.returnType?.startsWith("Promise<")
      ? func.returnType.slice(8, -1) // Extract the type inside Promise<T>
      : func.returnType || "any";

    return {
      name: func.name.toLowerCase(),
      type,
      index: index,
    };
  });
}

export function generateCode(functionInfos: FunctionInfo[]): string {
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
      ...functionInfos.map((f, i) => createVariableWithFunctionCall(f, i)),
    ])
  );

  return ts
    .createPrinter()
    .printNode(
      ts.EmitHint.Unspecified,
      functionDeclaration,
      ts.createSourceFile("temp.ts", "", ts.ScriptTarget.Latest)
    );
}
