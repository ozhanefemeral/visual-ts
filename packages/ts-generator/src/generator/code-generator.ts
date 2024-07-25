import { CodeBlock } from "types";
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
import { CodeGeneratorState } from "types/generator";

export function generateCode(blocks: CodeBlock[]): string {
  const state: CodeGeneratorState = {
    blocks: blocks,
    variables: [],
    isAsync: blocks.some((block) => block.isAsync),
  };

  const statements: Statement[] = blocks.map((block) =>
    blockToTypeScript(block, state)
  );
  const functionName = "generatedFunction";

  const isAsync = state.isAsync;

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
