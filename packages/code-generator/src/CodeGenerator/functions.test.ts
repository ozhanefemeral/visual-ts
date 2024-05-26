import ts from "typescript";
import {
  VariableInfoWithIndex,
  createFunctionCall,
  createVariableWithFunctionCall,
  extractVariables,
  generateCode,
} from "./functions";
import { FunctionInfo } from "@parser/module-parser/types";

describe("dummy test for 'packages/code-generator'", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

describe("createFunctionCall", () => {
  it("should create a function call expression", () => {
    const functionInfo = {
      name: "myFunction",
      returnType: "void",
      parameters: [],
      jsDocComment: "This is a test function.",
      code: "function myFunction() {\n  console.log('Hello, world!');\n}",
      variables: [],
    };

    const result = createFunctionCall(functionInfo);
    const codeString = ts
      .createPrinter()
      .printNode(
        ts.EmitHint.Unspecified,
        result,
        ts.createSourceFile("", "", ts.ScriptTarget.Latest)
      );

    expect(codeString).toBe("myFunction()");
  });

  it("should create a function call expression with parameters", () => {
    const functionInfo = {
      name: "myFunction",
      returnType: "void",
      parameters: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "age",
          type: "number",
        },
      ],
      jsDocComment: "This is a test function.",
      code: "function myFunction(name: string, age: number) {\n  console.log('Hello, world!');\n}",
      variables: [],
    };

    const result = createFunctionCall(functionInfo);
    const codeString = ts
      .createPrinter()
      .printNode(
        ts.EmitHint.Unspecified,
        result,
        ts.createSourceFile("", "", ts.ScriptTarget.Latest)
      );

    expect(codeString).toBe("myFunction(name, age)");
  });

  it("should create a function call expression with async functions", () => {
    const functionInfo = {
      name: "myFunction",
      returnType: "Promise<void>",
      parameters: [],
      jsDocComment: "This is a test function.",
      code: "async function myFunction() {\n  console.log('Hello, world!');\n}",
      variables: [],
    };

    const result = createFunctionCall(functionInfo);
    const codeString = ts
      .createPrinter()
      .printNode(
        ts.EmitHint.Unspecified,
        result,
        ts.createSourceFile("", "", ts.ScriptTarget.Latest)
      );

    expect(codeString).toBe("await myFunction()");
  });

  it("should create a function call expression with async functions with parameters", () => {
    const functionInfo = {
      name: "myFunction",
      returnType: "Promise<void>",
      parameters: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "age",
          type: "number",
        },
      ],
      jsDocComment: "This is a test function.",
      code: "async function myFunction(name: string, age: number) {\n  console.log('Hello, world!');\n}",
      variables: [],
    };

    const result = createFunctionCall(functionInfo);
    const codeString = ts
      .createPrinter()
      .printNode(
        ts.EmitHint.Unspecified,
        result,
        ts.createSourceFile("", "", ts.ScriptTarget.Latest)
      );

    expect(codeString).toBe("await myFunction(name, age)");
  });
});

describe("createVariableWithFunctionCall", () => {
  it("should create a variable declaration with a function call", () => {
    const functionInfo = {
      name: "myFunction",
      returnType: "void",
      parameters: [],
      jsDocComment: "This is a test function.",
      code: "function myFunction() {\n  console.log('Hello, world!');\n}",
      variables: [],
    };

    const result = createVariableWithFunctionCall(functionInfo, 0);
    const codeString = ts
      .createPrinter()
      .printNode(
        ts.EmitHint.Unspecified,
        result,
        ts.createSourceFile("", "", ts.ScriptTarget.Latest)
      );

    expect(codeString).toBe("const myfunction = myFunction();");
  });

  it("should create a variable declaration with a function call with parameters", () => {
    const functionInfo = {
      name: "myFunction",
      returnType: "void",
      parameters: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "age",
          type: "number",
        },
      ],
      jsDocComment: "This is a test function.",
      code: "function myFunction(name: string, age: number) {\n  console.log('Hello, world!');\n}",
      variables: [],
    };

    const result = createVariableWithFunctionCall(functionInfo, 0);
    const codeString = ts
      .createPrinter()
      .printNode(
        ts.EmitHint.Unspecified,
        result,
        ts.createSourceFile("", "", ts.ScriptTarget.Latest)
      );

    expect(codeString).toBe("const myfunction = myFunction(name, age);");
  });
});

describe("extractVariables", () => {
  it("should extract variables with their types and indices", () => {
    const functionInfos: FunctionInfo[] = [
      {
        name: "myFunction",
        returnType: "void",
        parameters: [],
        jsDocComment: "This is a test function.",
        code: "function myFunction() {\n  console.log('Hello, world!');\n}",
        variables: [],
      },
      {
        name: "greetUser",
        returnType: "Promise<string>",
        parameters: [
          {
            name: "name",
            type: "string",
          },
        ],
        jsDocComment: "This function greets a user.",
        code: "async function greetUser(name: string) {\n  return `Hello, ${name}!`;\n}",
        variables: [],
      },
      {
        name: "calculateSum",
        returnType: "number",
        parameters: [
          {
            name: "a",
            type: "number",
          },
          {
            name: "b",
            type: "number",
          },
        ],
        jsDocComment: "This function calculates the sum of two numbers.",
        code: "function calculateSum(a: number, b: number) {\n  return a + b;\n}",
        variables: [],
      },
    ];

    const expectedVariables: VariableInfoWithIndex[] = [
      {
        name: "myfunction",
        type: "void",
        index: 0,
      },
      {
        name: "greetuser",
        type: "string",
        index: 1,
      },
      {
        name: "calculatesum",
        type: "number",
        index: 2,
      },
    ];

    const result = extractVariables(functionInfos);
    expect(result).toEqual(expectedVariables);
  });
});
