import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import {
  CodeBlock,
  FunctionInfo,
  createFunctionCallBlock,
} from "@ozhanefe/ts-codegenerator";
import { useCodeGenerator } from "./CodeGeneratorContext";

interface Context {
  currentBlock: CodeBlock | null;
  setCurrentBlock: Dispatch<SetStateAction<CodeBlock | null>>;
  createFunctionInside: (func: FunctionInfo) => void;
}

const BlockEditorContext = createContext<Context>({
  currentBlock: null,
  setCurrentBlock: () => {},
  createFunctionInside: () => {},
});

export const BlockEditorProvider = ({ children }: PropsWithChildren<{}>) => {
  const { setState } = useCodeGenerator();
  const [currentBlock, setCurrentBlock] = useState<CodeBlock | null>(null);

  const createFunctionInside = (func: FunctionInfo) => {
    if (!currentBlock) return;

    switch (currentBlock.blockType) {
      case "if": {
        setState((state) => {
          const { state: newState } = createFunctionCallBlock(
            func,
            state,
            currentBlock
          );
          return newState;
        });
      }
    }
  };

  return (
    <BlockEditorContext.Provider
      value={{
        currentBlock,
        setCurrentBlock,
        createFunctionInside,
      }}
    >
      {children}
    </BlockEditorContext.Provider>
  );
};

export const useBlockEditor = () => {
  return useContext(BlockEditorContext);
};
