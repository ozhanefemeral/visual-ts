import { FunctionInfo, VariableInfo } from "@repo/parser";
import ts from "typescript";

export interface VariableInfoWithIndex extends VariableInfo {
  index: number;
}

/**
 * Creates a function call expression.
 * @param functionInfo Information about the function to call.
 * @param variables Available variables to use as parameters.
 * @param index Current index in the function sequence.
 * @returns A CallExpression or AwaitExpression.
 */
export function createFunctionCall(
  functionInfo: FunctionInfo,
  variables: VariableInfoWithIndex[],
  index: number
): ts.CallExpression | ts.AwaitExpression {
  const parameterExpressions =
    functionInfo.parameters?.map((param) => {
      const variable = findVariableByType(variables, param.type, true, index);
      return variable
        ? ts.factory.createIdentifier(variable.name)
        : ts.factory.createIdentifier(param.name);
    }) || [];

  const callExpression = ts.factory.createCallExpression(
    ts.factory.createIdentifier(functionInfo.name),
    undefined,
    parameterExpressions
  );

  return functionInfo.returnType?.includes("Promise")
    ? ts.factory.createAwaitExpression(callExpression)
    : callExpression;
}

/**
 * Creates a variable declaration with a function call.
 * @param functionInfo Information about the function to call.
 * @param variables Available variables.
 * @param index Current index in the function sequence.
 * @returns A VariableStatement.
 */
export function createVariableWithFunctionCall(
  functionInfo: FunctionInfo,
  variables: VariableInfoWithIndex[],
  index: number
): ts.VariableStatement {
  const variableName = functionInfo.name.toLowerCase();
  const existingVariables = variables.filter(
    (v) => v.name.startsWith(variableName) && v.index < index
  );
  const variableCount = existingVariables.length;

  const newVariableName =
    variableCount > 0 ? `${variableName}${variableCount + 1}` : variableName;

  return ts.factory.createVariableStatement(
    undefined,
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(newVariableName),
          undefined,
          undefined,
          createFunctionCall(functionInfo, variables, index)
        ),
      ],
      ts.NodeFlags.Const
    )
  );
}

/**
 * Extracts variables from function information.
 * @param functionInfos Array of function information.
 * @returns Array of variable information.
 */
export function extractVariables(
  functionInfos: FunctionInfo[]
): VariableInfoWithIndex[] {
  return functionInfos.map((func, index) => ({
    name: func.name.toLowerCase(),
    type: func.returnType?.startsWith("Promise<")
      ? func.returnType.slice(8, -1)
      : func.returnType || "any",
    index: index,
  }));
}

/**
 * Finds a variable by type.
 * @param variables Available variables.
 * @param type Type to search for.
 * @param latest Whether to return the latest matching variable.
 * @param toIndex Upper bound index to search.
 * @returns Matching variable information or undefined.
 */
export function findVariableByType(
  variables: VariableInfoWithIndex[],
  type: string,
  latest = true,
  toIndex = Infinity
): VariableInfoWithIndex | undefined {
  const filteredVariables = variables.filter((v, i) => i < toIndex);

  if (latest) {
    return filteredVariables.reverse().find((v) => v.type === type);
  }

  return filteredVariables.find((v) => v.type === type);
}

/**
 * Generates code based on function information.
 * @param functionInfos Array of function information.
 * @param variables Available variables.
 * @param options Code generation options.
 * @returns Generated code as a string.
 */
export function generateCode(
  functionInfos: FunctionInfo[],
  variables: VariableInfoWithIndex[]
): string {
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
      ...functionInfos.map((f, i) =>
        createVariableWithFunctionCall(f, variables, i)
      ),
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
