import {
  FunctionInfo,
  VariableInfoWithIndex,
  extractVariables,
  generateCode,
} from "@ozhanefe/ts-codegenerator/src/index";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { createProject, ts, Project } from "@ts-morph/bootstrap";

interface Context {
  functions: FunctionInfo[];
  variables: VariableInfoWithIndex[];
  setVariables: (variables: VariableInfoWithIndex[]) => void;
  setFunctions: (functions: FunctionInfo[]) => void;
  code: string;
  project: Project | null;
  program: ts.Program | null;
  sourceFile: ts.SourceFile | null;
}

const CodeGeneratorContext = createContext<Context>({
  functions: [],
  variables: [],
  setVariables: () => {},
  setFunctions: () => {},
  code: "",
  project: null,
  program: null,
  sourceFile: null,
});

export const CodeGeneratorProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [functions, setFunctions] = useState<FunctionInfo[]>([]);
  const [variables, setVariables] = useState<VariableInfoWithIndex[]>([]);
  const [code, setCode] = useState<string>("");
  const [project, setProject] = useState<Project | null>(null);
  const [program, setProgram] = useState<ts.Program | null>(null);
  const [sourceFile, setSourceFile] = useState<ts.SourceFile | null>(null);

  useEffect(() => {
    const initializeTsMorph = async () => {
      const project = await createProject({ useInMemoryFileSystem: true });
      const sourceFile = project.createSourceFile("index.ts", "");
      const program = project.createProgram();
      setProject(project);
      setSourceFile(sourceFile);
      setProgram(program);
    };

    initializeTsMorph();
  }, []);

  useEffect(() => {
    setCode(generateCode(functions));
    setVariables(extractVariables(functions));
  }, [functions, setFunctions]);

  return (
    <CodeGeneratorContext.Provider
      value={{
        functions,
        variables,
        setFunctions,
        setVariables,
        code,
        project,
        program,
        sourceFile,
      }}
    >
      {children}
    </CodeGeneratorContext.Provider>
  );
};

export const useCodeGenerator = () => {
  return useContext(CodeGeneratorContext);
};
