import {
  extractReturnType,
  findVariableByType,
  getUniqueVariableName,
  PROMISE_PREFIX,
} from "generator/utils";
import { FunctionCallBlock, FunctionInfo, VariableInfoWithIndex } from "types";
import { CodeGeneratorState } from "types/generator";
import {
  AwaitExpression,
  CallExpression,
  Expression,
  factory,
  NodeFlags,
  VariableDeclaration,
  VariableStatement,
} from "typescript";

/**
 * Creates a variable declaration with a function call.
 *
 * @param {FunctionCallBlock} block - The block containing information about the function to call.
 * @param {VariableInfoWithIndex[]} variables - The available variables.
 * @return {VariableStatement} The created variable declaration with a function call.
 */
export function createVariableWithFunctionCall(
  block: FunctionCallBlock,
  state: CodeGeneratorState | { variables: VariableInfoWithIndex[] }
): VariableStatement {
  return factory.createVariableStatement(
    undefined,
    factory.createVariableDeclarationList(
      [
        createVariableDeclaration(
          block.returnVariable?.name,
          block.functionInfo,
          state.variables,
          block.index
        ),
      ],
      NodeFlags.Const
    )
  );
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
 * Creates a function call block.
 *
 * @param {FunctionInfo} functionInfo - Information about the function to call.
 * @param {CodeGeneratorState} state - The current state of the code generator.
 * @return {FunctionCallBlock} The created function call block.
 */
export function createFunctionCallBlock(
  functionInfo: FunctionInfo,
  state: CodeGeneratorState
): FunctionCallBlock {
  const index = state.blocks.length;

  const variableName = functionInfo.name.toLowerCase();
  const newVariableName = getUniqueVariableName(variableName, state.variables);

  const newVariable: VariableInfoWithIndex = {
    name: newVariableName,
    type: extractReturnType(functionInfo.returnType),
    index: index,
  };
  const block: FunctionCallBlock = {
    functionInfo,
    parameters: functionInfo.parameters,
    returnVariable: newVariable,
    isAsync: !!functionInfo.returnType?.includes(PROMISE_PREFIX),
    index: index,
    blockType: "functionCall",
  };

  state.blocks.push(block);
  state.variables.push(newVariable);

  return block;
}

/**
 * Converts a function call block into a TypeScript variable statement.
 *
 * @param {FunctionCallBlock} block - The function call block to convert.
 * @param {CodeGeneratorState | { variables: VariableInfoWithIndex[] }} state - The state of the code generator.
 * @return {VariableStatement} The TypeScript variable statement representing the function call block.
 */
export function functionCallBlockToTypeScript(
  block: FunctionCallBlock,
  state: CodeGeneratorState | { variables: VariableInfoWithIndex[] }
): VariableStatement {
  return createVariableWithFunctionCall(block, state);
}
