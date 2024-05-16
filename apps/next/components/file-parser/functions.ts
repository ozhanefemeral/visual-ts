import fs from "fs";
import path from "path";
import { FunctionInfo, VariableInfo } from "./types";
import * as ts from "typescript";

export function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

export function determineFileType(filePath: string): string {
  return path.extname(filePath);
}

export function getFileName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

export function updateStateVariables(line: string, stateVariables: string[]) {
  const stateMatch = line.match(/const \[(.*?)\] = useState<(\w+)>\((\w+)\)/);
  if (stateMatch && stateMatch[1]) {
    stateVariables.push(stateMatch[1]);
  }
}

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
        jsDocComment,
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

/**
 * Extract functions from a TypeScript file.
 * Uses the TypeScript compiler API to traverse the AST and extract function information.
 */
export function updateFunctions(
  fileContent: string,
  functions: FunctionInfo[]
) {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    fileContent,
    ts.ScriptTarget.Latest,
    true
  );

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isFunctionDeclaration(node)) {
      const functionInfo: FunctionInfo = {
        name: node.name?.getText() || "",
        returnType: node.type?.getText() || "void",
      };

      // Add the function information to the provided array
      functions.push(functionInfo);
    }
  });
}

export function updateComponentFunctions(
  line: string,
  functions: FunctionInfo[]
) {
  const arrowFunctionMatch = line.match(/const (\w+) = \(\) =>/);
  const namedFunctionMatch = line.match(/function (\w+)/);
  const asyncArrowFunctionMatch = line.match(/const (\w+) = async \(\) =>/);
  const asyncNamedFunctionMatch = line.match(/async function (\w+)/);

  if (arrowFunctionMatch && arrowFunctionMatch[1]) {
    functions.push({
      name: arrowFunctionMatch[1],
      returnType: "void",
    });
  } else if (namedFunctionMatch && namedFunctionMatch[1]) {
    functions.push({
      name: namedFunctionMatch[1],
      returnType: "void",
    });
  } else if (asyncArrowFunctionMatch && asyncArrowFunctionMatch[1]) {
    functions.push({
      name: asyncArrowFunctionMatch[1],
      returnType: "Promise<void>",
    });
  } else if (asyncNamedFunctionMatch && asyncNamedFunctionMatch[1]) {
    functions.push({
      name: asyncNamedFunctionMatch[1],
      returnType: "Promise<void>",
    });
  }
}

/**
 * Identify buttons in the component. Gets the button label from next line, so the Button should be multiline.
 *  @example
 * <Button onClick={handleClick}>
 *  Increment
 * </Button>
 */
export function updateButtons(
  line: string,
  buttons: { label: string; handler: string }[],
  lines: string[]
) {
  const buttonMatch = line.match(/\b(\w+)\b.*?onClick={(\w+)}/);
  if (buttonMatch) {
    const lineIndex = lines.indexOf(line);
    const buttonLabel = lines[lineIndex + 1];

    if (buttonLabel && buttonMatch[2]) {
      buttons.push({
        label: buttonLabel.trim(),
        handler: buttonMatch[2],
      });
    }
  }
}

export function updateInterfaces(line: string, interfaces: string[]) {
  const interfaceMatch = line.match(/interface (\w+)/);
  if (interfaceMatch && interfaceMatch[1]) {
    interfaces.push(interfaceMatch[1]);
  }
}

function parseVariables(node: ts.Node): VariableInfo[] {
  const variables: VariableInfo[] = [];

  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node)) {
      if (node.name && ts.isIdentifier(node.name)) {
        const name = node.name.text;
        const type = node.type ? node.type.getText() : "any";
        variables.push({ name, type });
      }
    } else {
      ts.forEachChild(node, visit);
    }
  }

  visit(node);
  return variables;
}

function getFunctionVariables(
  sourceFile: ts.SourceFile,
  functionName: string
): VariableInfo[] | undefined {
  let variables: VariableInfo[] | undefined;

  function visit(node: ts.Node) {
    if (
      ts.isFunctionDeclaration(node) &&
      node.name &&
      node.name.text === functionName
    ) {
      variables = parseVariables(node);
    } else if (
      ts.isFunctionExpression(node) &&
      node.name &&
      node.name.text === functionName
    ) {
      variables = parseVariables(node);
    } else {
      ts.forEachChild(node, visit);
    }
  }

  visit(sourceFile);
  return variables;
}
