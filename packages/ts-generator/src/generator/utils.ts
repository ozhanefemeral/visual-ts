import { FunctionInfo, VariableInfoWithIndex } from "types";

export const PROMISE_PREFIX = "Promise<";

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
 * Generates a unique variable name.
 * @param baseName The base name for the variable.
 * @param variables Existing variables.
 * @returns A unique variable name.
 */
export function getUniqueVariableName(
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
export function extractReturnType(returnType: string | undefined): string {
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
