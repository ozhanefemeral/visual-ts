import { PropsWithChildren, createContext, useContext, useState } from "react";
import { FunctionInfo } from "@repo/parser";

interface Context {
  functions: any[];
  setFunctions: (functions: FunctionInfo[]) => void;
}

const CodeGeneratorContext = createContext<Context>({
  functions: [],
  setFunctions: () => {},
});

export const CodeGeneratorProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [functions, setFunctions] = useState<FunctionInfo[]>([]);

  return (
    <CodeGeneratorContext.Provider
      value={{
        functions,
        setFunctions,
      }}
    >
      {children}
    </CodeGeneratorContext.Provider>
  );
};

export const useCodeGenerator = () => {
  return useContext(CodeGeneratorContext);
};
