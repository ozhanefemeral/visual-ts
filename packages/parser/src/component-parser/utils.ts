import { FunctionInfo } from "../module-parser/types";
import { ButtonInfo } from "./types";

export function updateStateVariables(line: string, stateVariables: string[]) {
  const stateMatch = line.match(/const \[(.*?)\] = useState<(\w+)>\((\w+)\)/);
  if (stateMatch) {
    stateVariables.push(stateMatch[1]);
  }
}

export function updateComponentFunctions(
  line: string,
  functions: FunctionInfo[]
) {
  const arrowFunctionMatch = line.match(/const (\w+) = \(\) =>/);
  const namedFunctionMatch = line.match(/function (\w+)/);
  const asyncArrowFunctionMatch = line.match(/const (\w+) = async \(\) =>/);
  const asyncNamedFunctionMatch = line.match(/async function (\w+)/);

  if (arrowFunctionMatch) {
    functions.push({
      name: arrowFunctionMatch[1],
      returnType: "void",
    });
  } else if (namedFunctionMatch) {
    functions.push({
      name: namedFunctionMatch[1],
      returnType: "void",
    });
  } else if (asyncArrowFunctionMatch) {
    functions.push({
      name: asyncArrowFunctionMatch[1],
      returnType: "Promise<void>",
    });
  } else if (asyncNamedFunctionMatch) {
    functions.push({
      name: asyncNamedFunctionMatch[1],
      returnType: "Promise<void>",
    });
  }
}

export function updateButtons(
  line: string,
  buttons: ButtonInfo[],
  lines: string[]
) {
  const buttonMatch = line.match(/\b(\w+)\b.*?onClick={(\w+)}/);
  if (buttonMatch) {
    const lineIndex = lines.indexOf(line);
    const buttonLabel = lines[lineIndex + 1];
    buttons.push({
      label: buttonLabel,
      handler: buttonMatch[2],
    });
  }
}

export function updateInterfaces(line: string, interfaces: string[]) {
  const interfaceMatch = line.match(/interface (\w+)/);
  if (interfaceMatch) {
    interfaces.push(interfaceMatch[1]);
  }
}
