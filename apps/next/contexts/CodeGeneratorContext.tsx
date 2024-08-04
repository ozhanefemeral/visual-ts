import {
  CodebaseInfo,
  CodeGeneratorState,
  generateCode,
} from "@ozhanefe/ts-codegenerator";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface Context {
  state: CodeGeneratorState;
  setState: Dispatch<SetStateAction<CodeGeneratorState>>;
  codebaseInfo: CodebaseInfo | null;
  setCodebaseInfo: Dispatch<SetStateAction<CodebaseInfo | null>>;
  code: string;
}

const CodeGeneratorContext = createContext<Context>({
  state: {
    blocks: [],
    variables: [],
    isAsync: false,
  },
  setState: () => {},
  codebaseInfo: null,
  setCodebaseInfo: () => {},
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
  const [code, setCode] = useState<string>("");
  const [codebaseInfo, setCodebaseInfo] = useState<CodebaseInfo | null>(null);

  useEffect(() => {
    setCode(generateCode(state.blocks));
  }, [state.blocks]);

  return (
    <CodeGeneratorContext.Provider
      value={{
        state,
        setState,
        code,
        codebaseInfo,
        setCodebaseInfo,
      }}
    >
      {children}
    </CodeGeneratorContext.Provider>
  );
};

export const useCodeGenerator = () => {
  return useContext(CodeGeneratorContext);
};
