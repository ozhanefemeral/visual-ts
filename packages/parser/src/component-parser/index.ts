import { FunctionInfo } from "../module-parser/types";
import { readFileContent } from "../utils/file-utils";
import { createTypeChecker } from "../utils/typescript-utils";
import { ButtonInfo } from "./types";
import {
  updateStateVariables,
  updateComponentFunctions,
  updateButtons,
  updateInterfaces,
} from "./utils";

export function parseComponentFromFile(filePath: string) {
  const fileContent = readFileContent(filePath);
  const lines = fileContent.split("\n");
  const typeChecker = createTypeChecker(filePath);

  const stateVariables: string[] = [];
  const functions: FunctionInfo[] = [];
  const buttons: ButtonInfo[] = [];
  const interfaces: string[] = [];

  for (const line of lines) {
    updateStateVariables(line, stateVariables);
    updateComponentFunctions(line, functions);
    updateButtons(line, buttons, lines);
    updateInterfaces(line, interfaces);
  }

  return {
    stateVariables,
    functions,
    buttons,
    interfaces,
  };
}
