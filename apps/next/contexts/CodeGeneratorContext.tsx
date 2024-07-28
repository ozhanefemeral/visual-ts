/* eslint-disable no-unused-vars */
import {
  CodeBlock,
  CodeGeneratorState,
  ElseIfBlock,
  FunctionCallBlock,
  generateCode,
  IfBlock,
  WhileLoopBlock
} from "@ozhanefe/ts-codegenerator";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface Context {
  state: CodeGeneratorState;
  setState: (state: CodeGeneratorState) => void;
  code: string;
}

const CodeGeneratorContext = createContext<Context>({
  state: {
    blocks: [],
    variables: [],
    isAsync: false
  },
  setState: () => {},
  code: "",
});

export const CodeGeneratorProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<CodeGeneratorState>(generateRealisticDevDayState());
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const initializeTsMorph = async () => {

    };

    initializeTsMorph();
  }, []);

  useEffect(() => {
    setCode(generateCode(state.blocks));   
  }, [state.blocks]);

  return (
    <CodeGeneratorContext.Provider
      value={{
        state,
        setState,
        code
      }}
    >
      {children}
    </CodeGeneratorContext.Provider>
  );
};

export const useCodeGenerator = () => {
  return useContext(CodeGeneratorContext);
};

function generateRealisticDevDayState(): CodeGeneratorState {
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