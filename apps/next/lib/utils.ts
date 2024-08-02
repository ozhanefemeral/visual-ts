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
    id: 0,
  };

  const getCoffee: FunctionCallBlock = {
    functionInfo: { name: "getCoffee", returnType: "void" },
    returnVariable: { name: "caffeinated", type: "boolean" },
    isAsync: false,
    index: 1,
    blockType: "functionCall",
    id: 1,
  };

  const writeCode: FunctionCallBlock = {
    functionInfo: { name: "writeCode", returnType: "number" },
    returnVariable: { name: "linesOfCode", type: "number" },
    isAsync: false,
    index: 2,
    blockType: "functionCall",
    id: 2,
  };

  const ifTired: IfBlock = {
    condition: "energyLevel < 30",
    thenBlocks: [getCoffee],
    elseBlock: { blocks: [writeCode], blockType: "else", id: 4, index: 4 },
    index: 3,
    blockType: "if",
    id: 3,
  };

  const coding: WhileLoopBlock = {
    condition: "workHours < 8",
    loopBlocks: [ifTired],
    index: 5,
    blockType: "while",
    id: 5,
  };

  const celebrate: FunctionCallBlock = {
    functionInfo: { name: "celebrate", returnType: "void" },
    returnVariable: { name: "partyTime", type: "boolean" },
    isAsync: false,
    index: 6,
    blockType: "functionCall",
    id: 6,
  };

  const playVideoGames: FunctionCallBlock = {
    functionInfo: { name: "playVideoGames", returnType: "void" },
    returnVariable: { name: "stressRelieved", type: "boolean" },
    isAsync: false,
    index: 7,
    blockType: "functionCall",
    id: 7,
  };

  const afterWorkMood: IfBlock = {
    condition: "linesOfCode > 100",
    thenBlocks: [celebrate],
    elseBlock: { blocks: [playVideoGames], blockType: "else", id: 9, index: 9 },
    index: 8,
    blockType: "if",
    id: 8,
  };

  const blocks: CodeBlock[] = [wakeUp, coding, afterWorkMood];

  return {
    blocks,
    variables: [
      { index: 0, name: "awake", type: "boolean" },
      { index: 1, name: "caffeinated", type: "boolean" },
      { index: 2, name: "energyLevel", type: "number" },
      { index: 3, name: "workHours", type: "number" },
      { index: 4, name: "linesOfCode", type: "number" },
      { index: 5, name: "partyTime", type: "boolean" },
      { index: 6, name: "stressRelieved", type: "boolean" },
    ],
    isAsync: false,
  };
}
