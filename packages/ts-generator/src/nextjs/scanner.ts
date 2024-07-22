// src/nextjs/scanner.ts

import { Project, SourceFile, Node } from "ts-morph";
import { FunctionInfo } from "../types";
import { ServerActionInfo, NextCodebaseInfo } from "./types";

export function scanNextjsCodebase(projectPath: string): NextCodebaseInfo {
  const project = new Project();
  project.addSourceFilesAtPaths(`${projectPath}/**/*.ts`);

  const serverActions: ServerActionInfo[] = [];

  project.getSourceFiles().forEach((sourceFile) => {
    if (isServerActionFile(sourceFile)) {
      serverActions.push(...extractServerActions(sourceFile));
    }
  });

  return { serverActions };
}

function isServerActionFile(sourceFile: SourceFile): boolean {
  return sourceFile.getFullText().trim().startsWith('"use server";');
}

function extractServerActions(sourceFile: SourceFile): ServerActionInfo[] {
  const serverActions: ServerActionInfo[] = [];

  sourceFile.getFunctions().forEach((func) => {
    if (func.isAsync()) {
      const functionInfo: FunctionInfo = {
        name: func.getName() || "anonymous",
        returnType: func.getReturnType().getText(),
        parameters: func.getParameters().map((param) => ({
          name: param.getName(),
          type: param.getType().getText(),
        })),
      };

      serverActions.push({
        ...functionInfo,
        filePath: sourceFile.getFilePath(),
      });
    }
  });

  return serverActions;
}
