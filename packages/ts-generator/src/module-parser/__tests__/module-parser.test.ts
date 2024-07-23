import { Project, SyntaxKind } from "ts-morph";
import { getFunctionInfoFromNode, parseFunctionsFromText } from "../parser";

describe("Module Parser", () => {
  describe("parseFunctionsFromText", () => {
    it("should parse functions from source code", () => {
      const sourceCode = `
        function testFunction(param: string): number {
          return param.length;
        }

        async function asyncFunction(): Promise<void> {
          await Promise.resolve();
        }
      `;

      const { functionsInfo, usedTypes } = parseFunctionsFromText(sourceCode);

      expect(functionsInfo).toBeDefined();
      expect(Array.isArray(functionsInfo)).toBe(true);
      expect(functionsInfo.length).toBe(2);
      expect(functionsInfo[0]?.name).toBe("testFunction");
      expect(functionsInfo[1]?.name).toBe("asyncFunction");

      expect(usedTypes).toBeDefined();
      expect(Array.isArray(usedTypes)).toBe(true);
      expect(usedTypes).toContain("string");
      expect(usedTypes).toContain("number");
      expect(usedTypes).toContain("Promise<void>");
    });

    it("should handle empty source code", () => {
      const sourceCode = "";
      const { functionsInfo, usedTypes } = parseFunctionsFromText(sourceCode);

      expect(functionsInfo).toEqual([]);
      expect(usedTypes).toEqual([]);
    });

    it("should handle source code with no functions", () => {
      const sourceCode = 'const a = 5; let b = "hello";';
      const { functionsInfo, usedTypes } = parseFunctionsFromText(sourceCode);

      expect(functionsInfo).toEqual([]);
      expect(usedTypes).toEqual([]);
    });
  });

  describe("getFunctionInfoFromNode", () => {
    it("should return function info for a function declaration", () => {
      const project = new Project();
      const sourceFile = project.createSourceFile(
        "temp.ts",
        "function testFunction(param: string): number { return 42; }"
      );
      const functionNode = sourceFile.getFirstDescendantByKind(
        SyntaxKind.FunctionDeclaration
      );

      if (!functionNode) {
        throw new Error("Function node not found");
      }

      const functionInfo = getFunctionInfoFromNode(functionNode);

      expect(functionInfo).toBeDefined();
      expect(functionInfo?.name).toBe("testFunction");
      expect(functionInfo?.returnType).toBe("number");
      expect(functionInfo?.parameters).toBeDefined();
      expect(functionInfo?.parameters).toHaveLength(1);
      expect(functionInfo?.parameters?.[0]).toEqual({
        name: "param",
        type: "string",
      });
    });

    it("should return null for non-function nodes", () => {
      const project = new Project();
      const sourceFile = project.createSourceFile(
        "temp.ts",
        "const variable = 42;"
      );
      const variableNode = sourceFile.getFirstDescendantByKind(
        SyntaxKind.VariableDeclaration
      );

      if (!variableNode) {
        throw new Error("Variable node not found");
      }

      const functionInfo = getFunctionInfoFromNode(variableNode);

      expect(functionInfo).toBeNull();
    });
  });
});
