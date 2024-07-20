import {
  factory,
  createPrinter,
  EmitHint,
  createSourceFile,
  ScriptTarget,
  SyntaxKind,
  NodeFlags,
} from "typescript";
import type {
  AwaitExpression,
  CallExpression,
  Expression,
  VariableDeclaration,
  VariableStatement,
} from "typescript";
import type { FunctionInfo, VariableInfoWithIndex } from "./types";

const PROMISE_PREFIX = "Promise<";

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
): CallExpression | AwaitExpression {
  const parameterExpressions = createParameterExpressions(
    functionInfo,
    variables,
    index
  );
  const callExpression = createCallExpression(
    functionInfo,
    parameterExpressions
  );

  return functionInfo.returnType?.includes(PROMISE_PREFIX)
    ? factory.createAwaitExpression(callExpression)
    : callExpression;
}

/**
 * Finds a variable by type.
 * @param variables Available variables.
 * @param type Type to search for.
 * @param latest Whether to return the latest matching variable.
 * @param toIndex Upper bound index to search.
 * @returns Matching variable information or undefined.
 */
function findVariableByType(
  variables: VariableInfoWithIndex[],
  type: string,
  latest = true,
  toIndex = Infinity
): VariableInfoWithIndex | undefined {
  const filteredVariables = variables.filter(
    (variable, index) => index < toIndex
  );

  if (latest) {
    return filteredVariables
      .reverse()
      .find((variable) => variable.type === type);
  }

  return filteredVariables.find((variable) => variable.type === type);
}

/**
 * Creates parameter expressions for a function call.
 * @param functionInfo Information about the function.
 * @param variables Available variables to use as parameters.
 * @param index Current index in the function sequence.
 * @returns An array of Expression nodes representing the parameters.
 */
function createParameterExpressions(
  functionInfo: FunctionInfo,
  variables: VariableInfoWithIndex[],
  index: number
): Expression[] {
  return (
    functionInfo.parameters?.map((param) => {
      const variable = findVariableByType(variables, param.type, true, index);
      const identifier = variable?.name ?? param.name;
      return factory.createIdentifier(identifier);
    }) ?? []
  );
}

/**
 * Creates a call expression for a function.
 * @param functionInfo Information about the function to call.
 * @param parameterExpressions Parameter expressions for the function call.
 * @returns A CallExpression node.
 */
function createCallExpression(
  functionInfo: FunctionInfo,
  parameterExpressions: Expression[]
): CallExpression {
  return factory.createCallExpression(
    factory.createIdentifier(functionInfo.name),
    undefined,
    parameterExpressions
  );
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
): VariableStatement {
  const variableName = functionInfo.name.toLowerCase();
  const newVariableName = getUniqueVariableName(variableName, variables);

  const newVariable: VariableInfoWithIndex = {
    name: newVariableName,
    type: extractReturnType(functionInfo.returnType),
    index,
  };
  variables.push(newVariable);

  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        createVariableDeclaration(
          newVariableName,
          functionInfo,
          variables,
          index
        ),
      ],
      NodeFlags.Const
    )
  );
}

/**
 * Creates a variable declaration node.
 * @param newVariableName The name for the new variable.
 * @param functionInfo Information about the function to call.
 * @param variables Available variables.
 * @param index Current index in the function sequence.
 * @returns A VariableDeclaration node.
 */
function createVariableDeclaration(
  newVariableName: string,
  functionInfo: FunctionInfo,
  variables: VariableInfoWithIndex[],
  index: number
): VariableDeclaration {
  return factory.createVariableDeclaration(
    factory.createIdentifier(newVariableName),
    undefined,
    undefined,
    createFunctionCall(functionInfo, variables, index)
  );
}

/**
 * Generates a unique variable name.
 * @param baseName The base name for the variable.
 * @param variables Existing variables.
 * @returns A unique variable name.
 */
function getUniqueVariableName(
  baseName: string,
  variables: VariableInfoWithIndex[]
): string {
  const existingNames = new Set(variables.map(({ name }) => name));
  if (!existingNames.has(baseName)) {
    return baseName;
  }
  let counter = 2;
  let newName = `${baseName}${counter}`;
  while (existingNames.has(newName)) {
    counter++;
    newName = `${baseName}${counter}`;
  }
  return newName;
}

/**
 * Extracts the return type from a function's return type string.
 * @param returnType The return type string of a function.
 * @returns The extracted return type.
 */
function extractReturnType(returnType: string | undefined): string {
  return returnType?.startsWith(PROMISE_PREFIX)
    ? returnType.slice(PROMISE_PREFIX.length, -1)
    : returnType ?? "any";
}

/**
 * Extracts variables from function information.
 * @param functionInfos Array of function information.
 * @returns Array of variable information with index.
 */
export function extractVariables(
  functionInfos: FunctionInfo[]
): VariableInfoWithIndex[] {
  return functionInfos.map((func, index) => ({
    name: func.name.toLowerCase(),
    type: extractReturnType(func.returnType),
    index: index,
  }));
}

/**
 * Generates code based on function information.
 * @param functionInfos Array of function information.
 * @returns Generated code as a string.
 */
export function generateCode(functionInfos: FunctionInfo[]): string {
  const functionName = "generatedFunction";
  const isAsync = functionInfos.some((functionInfo) =>
    functionInfo.returnType?.includes(PROMISE_PREFIX)
  );
  const variables: VariableInfoWithIndex[] = [];

  const functionDeclaration = factory.createFunctionDeclaration(
    isAsync ? [factory.createModifier(SyntaxKind.AsyncKeyword)] : undefined,
    undefined,
    functionName,
    undefined,
    [],
    undefined,
    factory.createBlock(
      functionInfos.map((functionInfo, index) =>
        createVariableWithFunctionCall(functionInfo, variables, index)
      )
    )
  );

  return createPrinter().printNode(
    EmitHint.Unspecified,
    functionDeclaration,
    createSourceFile("temp.ts", "", ScriptTarget.Latest)
  );
}
