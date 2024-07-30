import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  blocksToFlattenedNodes,
  CodeGeneratorState,
  FlattenedNode,
  generateCode,
} from "@ozhanefe/ts-codegenerator";

interface Context {
  state: CodeGeneratorState;
  setState: Dispatch<SetStateAction<CodeGeneratorState>>;
  flattenedNodes: FlattenedNode[];
  code: string;
}

const CodeGeneratorContext = createContext<Context>({
  state: { blocks: [], variables: [], isAsync: false },
  setState: () => {},
  flattenedNodes: [],
  code: "",
});

export const CodeGeneratorProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [state, setState] = useState<CodeGeneratorState>({
    blocks: [],
    variables: [],
    isAsync: false,
  });
  const [flattenedNodes, setFlattenedNodes] = useState<FlattenedNode[]>([]);
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    setFlattenedNodes(blocksToFlattenedNodes(state.blocks));
    setCode(generateCode(state.blocks));
  }, [state.blocks]);

  return (
    <CodeGeneratorContext.Provider
      value={{
        state,
        setState,
        flattenedNodes,
        code,
      }}
    >
      {children}
    </CodeGeneratorContext.Provider>
  );
};

export const useCodeGenerator = () => {
  return useContext(CodeGeneratorContext);
};
