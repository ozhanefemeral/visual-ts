import { CodeBlock, VariableInfoWithIndex } from "types";
import {
  factory,
  createPrinter,
  createSourceFile,
  SyntaxKind,
  Statement,
  EmitHint,
  ScriptTarget,
} from "typescript";
import { blockToTypeScript } from "./block-generator";

export function generateCode(codeBlocks: CodeBlock[]): string {
  const functionName = "generatedFunction";
  const isAsync = codeBlocks.some((block) => block.isAsync);
  const variables: VariableInfoWithIndex[] = [];

  let statements: Statement[] = [];

  for (const block of codeBlocks) {
    statements.push(blockToTypeScript(block, variables));
  }

  const functionDeclaration = factory.createFunctionDeclaration(
    isAsync ? [factory.createModifier(SyntaxKind.AsyncKeyword)] : undefined,
    undefined,
    functionName,
    undefined,
    [],
    undefined,
    factory.createBlock(statements)
  );

  return createPrinter().printNode(
    EmitHint.Unspecified,
    functionDeclaration,
    createSourceFile("temp.ts", "", ScriptTarget.Latest)
  );
}
