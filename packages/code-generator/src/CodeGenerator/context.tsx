import { FunctionInfo, VariableInfo } from "@repo/parser";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { generateCode } from "./functions";

interface Context {
  functions: FunctionInfo[];
  setFunctions: (functions: FunctionInfo[]) => void;
  code: string;
}

const CodeGeneratorContext = createContext<Context>({
  functions: [],
  setFunctions: () => {},
  code: "",
});

export const CodeGeneratorProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [functions, setFunctions] = useState<FunctionInfo[]>([]);
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    setCode(generateCode(functions));
  }, [functions, setFunctions]);

  return (
    <CodeGeneratorContext.Provider
      value={{
        functions,
        setFunctions,
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
