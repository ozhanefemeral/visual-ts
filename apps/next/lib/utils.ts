import {
  CodeGeneratorState,
  FunctionCallBlock,
  IfBlock,
  WhileLoopBlock,
  CodeBlock,
} from "@ozhanefe/ts-codegenerator";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// TODO: This returns different colors for the Promise<User[]>, User[], and User
// Ideal is: User should be base color, User[] should be a shade of User, and Promise<User[]> should be a shade of User[]
export function generateRandomColorFromStr(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  return `#${"00000".substring(0, 6 - c.length)}${c}`;
}

export function assignColorsToElements(elements: string[]) {
  return elements.map((element) => generateRandomColorFromStr(element));
}

export function generateRealisticDevDayState(): CodeGeneratorState {
  const wakeUp: FunctionCallBlock = {
    functionInfo: { name: "wakeUp", returnType: "void" },
    returnVariable: { name: "awake", type: "boolean" },
    isAsync: false,
    index: 0,
    blockType: "functionCall",
  };

  const getCoffee: FunctionCallBlock = {
    functionInfo: { name: "getCoffee", returnType: "void" },
    returnVariable: { name: "caffeinated", type: "boolean" },
    isAsync: false,
    index: 1,
    blockType: "functionCall",
  };

  const writeCode: FunctionCallBlock = {
    functionInfo: { name: "writeCode", returnType: "number" },
    returnVariable: { name: "linesOfCode", type: "number" },
    isAsync: false,
    index: 2,
    blockType: "functionCall",
  };

  const ifTired: IfBlock = {
    condition: "energyLevel < 30",
    thenBlocks: [getCoffee],
    elseBlock: { blocks: [writeCode] },
    index: 3,
    blockType: "if",
  };

  const coding: WhileLoopBlock = {
    condition: "workHours < 8",
    loopBlocks: [ifTired],
    index: 4,
    blockType: "while",
  };

  const celebrate: FunctionCallBlock = {
    functionInfo: { name: "celebrate", returnType: "void" },
    returnVariable: { name: "partyTime", type: "boolean" },
    isAsync: false,
    index: 5,
    blockType: "functionCall",
  };

  const playVideoGames: FunctionCallBlock = {
    functionInfo: { name: "playVideoGames", returnType: "void" },
    returnVariable: { name: "stressRelieved", type: "boolean" },
    isAsync: false,
    index: 6,
    blockType: "functionCall",
  };

  const afterWorkMood: IfBlock = {
    condition: "linesOfCode > 100",
    thenBlocks: [celebrate],
    elseBlock: { blocks: [playVideoGames] },
    index: 7,
    blockType: "if",
  };

  const blocks: CodeBlock[] = [wakeUp, coding, afterWorkMood];

  return {
    blocks,
    variables: [
      { name: "awake", type: "boolean", index: 0 },
      { name: "energyLevel", type: "number", index: 1 },
      { name: "workHours", type: "number", index: 2 },
      { name: "linesOfCode", type: "number", index: 3 },
      { name: "caffeinated", type: "boolean", index: 4 },
      { name: "partyTime", type: "boolean", index: 5 },
      { name: "stressRelieved", type: "boolean", index: 6 },
    ],
    isAsync: false,
  };
}
