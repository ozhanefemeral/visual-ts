import ts from "typescript";
import {
  createFunctionCall,
  createVariableWithFunctionCall,
  generateCode,
} from "./functions";

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

    const result = createVariableWithFunctionCall(functionInfo);
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

    const result = createVariableWithFunctionCall(functionInfo);
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
