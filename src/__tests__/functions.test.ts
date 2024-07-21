import ts from "typescript";
import {
  createFunctionCall,
  createVariableWithFunctionCall,
  extractVariables,
  generateCode,
} from "../functions";
import { FunctionInfo, VariableInfoWithIndex } from "../types";

describe("Code Generator Functions", () => {
  const mockFunctionInfo: FunctionInfo = {
    name: "testFunction",
    returnType: "string",
    parameters: [{ name: "param1", type: "number" }],
    jsDocComment: "Test function",
    code: "function testFunction(param1: number): string { return param1.toString(); }",
    variables: [],
  };

  describe("createFunctionCall", () => {
    it("should create a function call expression", () => {
      const variables: VariableInfoWithIndex[] = [
        { name: "testVar", type: "number", index: 0 },
      ];
      const result = createFunctionCall(mockFunctionInfo, variables, 1);
      const codeString = ts
        .createPrinter()
        .printNode(
          ts.EmitHint.Unspecified,
          result,
          ts.createSourceFile("", "", ts.ScriptTarget.Latest)
        );

      expect(codeString).toBe("testFunction(testVar)");
    });

    it("should create an async function call expression", () => {
      const asyncFunctionInfo: FunctionInfo = {
        ...mockFunctionInfo,
        returnType: "Promise<string>",
      };
      const variables: VariableInfoWithIndex[] = [
        { name: "testVar", type: "number", index: 0 },
      ];
      const result = createFunctionCall(asyncFunctionInfo, variables, 1);
      const codeString = ts
        .createPrinter()
        .printNode(
          ts.EmitHint.Unspecified,
          result,
          ts.createSourceFile("", "", ts.ScriptTarget.Latest)
        );

      expect(codeString).toBe("await testFunction(testVar)");
    });
  });

  describe("createVariableWithFunctionCall", () => {
    it("should create a variable statement with a function call", () => {
      const variables: VariableInfoWithIndex[] = [];
      const result = createVariableWithFunctionCall(
        mockFunctionInfo,
        variables,
        0
      );
      const codeString = ts
        .createPrinter()
        .printNode(
          ts.EmitHint.Unspecified,
          result,
          ts.createSourceFile("", "", ts.ScriptTarget.Latest)
        );

      expect(codeString).toBe("const testfunction = testFunction(param1);");
      expect(variables).toHaveLength(1);
      expect(variables[0]).toEqual({
        name: "testfunction",
        type: "string",
        index: 0,
      });
    });

    it("should create a unique variable name if the name is already used", () => {
      const variables: VariableInfoWithIndex[] = [
        { name: "testfunction", type: "string", index: 0 },
      ];
      const result = createVariableWithFunctionCall(
        mockFunctionInfo,
        variables,
        1
      );
      const codeString = ts
        .createPrinter()
        .printNode(
          ts.EmitHint.Unspecified,
          result,
          ts.createSourceFile("", "", ts.ScriptTarget.Latest)
        );

      expect(codeString).toBe("const testfunction2 = testFunction(param1);");
      expect(variables).toHaveLength(2);
      expect(variables[1]).toEqual({
        name: "testfunction2",
        type: "string",
        index: 1,
      });
    });
  });

  describe("extractVariables", () => {
    it("should extract variables from function information", () => {
      const functionInfos: FunctionInfo[] = [
        mockFunctionInfo,
        {
          ...mockFunctionInfo,
          name: "anotherFunction",
          returnType: "number",
        },
      ];

      const result = extractVariables(functionInfos);

      expect(result).toEqual([
        { name: "testfunction", type: "string", index: 0 },
        { name: "anotherfunction", type: "number", index: 1 },
      ]);
    });
  });

  describe("generateCode", () => {
    it("should generate code based on function information", () => {
      const functionInfos: FunctionInfo[] = [mockFunctionInfo];
      const result = generateCode(functionInfos);

      expect(result).toContain("function generatedFunction()");
      expect(result).toContain("const testfunction = testFunction(param1);");
    });

    it("should generate code with multiple function calls", () => {
      const functionInfos: FunctionInfo[] = [
        mockFunctionInfo,
        {
          ...mockFunctionInfo,
          name: "anotherFunction",
          returnType: "number",
          parameters: [{ name: "param1", type: "string" }],
        },
      ];
      const result = generateCode(functionInfos);

      expect(result).toContain("function generatedFunction()");
      expect(result).toContain("const testfunction = testFunction(param1);");
      expect(result).toContain(
        "const anotherfunction = anotherFunction(testfunction);"
      );
    });

    it("should handle async functions", () => {
      const asyncFunctionInfo: FunctionInfo = {
        ...mockFunctionInfo,
        returnType: "Promise<string>",
      };
      const result = generateCode([asyncFunctionInfo]);

      expect(result).toContain("async function generatedFunction()");
      expect(result).toContain(
        "const testfunction = await testFunction(param1);"
      );
    });
  });
});
