import { Project, SourceFile, Node, SyntaxKind } from "ts-morph";

export interface SearchResult {
  type: "function" | "component" | "interface" | "type" | "variable";
  name: string;
  filePath: string;
  lineNumber: number;
}

export class CodebaseSearcher {
  private project: Project;

  constructor(codebasePath: string) {
    this.project = new Project({
      tsConfigFilePath: `${codebasePath}/tsconfig.json`,
    });
    this.project.addSourceFilesAtPaths([
      `${codebasePath}/**/*.ts`,
      `${codebasePath}/**/*.tsx`,
    ]);

    const nodeModulesFiles = this.project
      .getSourceFiles()
      .filter((file) => file.isInNodeModules());

    nodeModulesFiles.forEach((file) => {
      this.project.removeSourceFile(file);
    });
  }

  public async search(query: string): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const sourceFiles = this.project.getSourceFiles();

    for (const sourceFile of sourceFiles) {
      this.searchInFile(sourceFile, query.toLowerCase(), results);
    }

    return results;
  }

  private searchInFile(
    sourceFile: SourceFile,
    query: string,
    results: SearchResult[]
  ) {
    sourceFile.forEachDescendant((node: Node) => {
      let type: SearchResult["type"] | undefined;
      let name: string | undefined;

      if (Node.isFunctionDeclaration(node) || Node.isMethodDeclaration(node)) {
        type = "function";
        name = node.getName();
      } else if (Node.isClassDeclaration(node) && node.isExported()) {
        type = "component";
        name = node.getName();
      } else if (Node.isInterfaceDeclaration(node)) {
        type = "interface";
        name = node.getName();
      } else if (Node.isTypeAliasDeclaration(node)) {
        type = "type";
        name = node.getName();
      } else if (Node.isVariableDeclaration(node)) {
        type = "variable";
        name = node.getName();
      }

      if (type && name && name.toLowerCase().includes(query)) {
        const { line } = sourceFile.getLineAndColumnAtPos(node.getStart());
        results.push({
          type,
          name,
          filePath: sourceFile.getFilePath(),
          lineNumber: line,
        });
      }
    });
  }

  public getProjectDetails(): { fileCount: number; lineCount: number } {
    const sourceFiles = this.project.getSourceFiles();
    const fileCount = sourceFiles.length;
    const lineCount = sourceFiles.reduce((total, file) => {
      const { line } = file.getLineAndColumnAtPos(file.getEnd());
      return total + line;
    }, 0);
    return { fileCount, lineCount };
  }
}

export function initializeSearcher(codebasePath: string): CodebaseSearcher {
  try {
    return new CodebaseSearcher(codebasePath);
  } catch (error) {
    console.error("Failed to initialize CodebaseSearcher:", error);
    throw new Error(
      "Failed to initialize CodebaseSearcher. Please check the codebase path and ensure tsconfig.json exists."
    );
  }
}
