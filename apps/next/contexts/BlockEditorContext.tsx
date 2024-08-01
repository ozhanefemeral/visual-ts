import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { CodeBlock } from "@ozhanefe/ts-codegenerator";

interface Context {
  currentBlock: CodeBlock | null;
  setCurrentBlock: Dispatch<SetStateAction<CodeBlock | null>>;
}

const BlockEditorContext = createContext<Context>({
  currentBlock: null,
  setCurrentBlock: () => {},
});

export const BlockEditorProvider = ({ children }: PropsWithChildren<{}>) => {
  const [currentBlock, setCurrentBlock] = useState<CodeBlock | null>(null);

  useEffect(() => {
    console.log("currentBlock:", currentBlock);
  }, [currentBlock]);

  return (
    <BlockEditorContext.Provider
      value={{
        currentBlock,
        setCurrentBlock,
      }}
    >
      {children}
    </BlockEditorContext.Provider>
  );
};

export const useBlockEditor = () => {
  return useContext(BlockEditorContext);
};
