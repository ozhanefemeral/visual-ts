import * as ts from "typescript";

export function createTypeChecker(filePath: string): ts.TypeChecker {
  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.CommonJS,
  };
  const program = ts.createProgram([filePath], compilerOptions);
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) {
    throw new Error("Source file not found");
  }
  return program.getTypeChecker();
}
