import { Project, SourceFile } from "ts-morph";
import { ServerActionInfo, NextCodebaseInfo } from "./types";

export function scanNextjsCodebase(projectPath: string): NextCodebaseInfo {
  const project = new Project();
  project.addSourceFilesAtPaths(`${projectPath}/**/*.ts`);
  return analyzeNextjsSourceFiles(project.getSourceFiles());
}

export function analyzeNextjsSourceFiles(
  sourceFiles: SourceFile[]
): NextCodebaseInfo {
  const serverActions: ServerActionInfo[] = [];

  sourceFiles.forEach((sourceFile) => {
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
      const functionInfo: ServerActionInfo = {
        name: func.getName() || "anonymous",
        returnType: func.getReturnType().getText(),
        parameters: func.getParameters().map((param) => ({
          name: param.getName(),
          type: param.getType().getText(),
        })),
        filePath: sourceFile.getFilePath(),
      };

      serverActions.push(functionInfo);
    }
  });

  return serverActions;
}
