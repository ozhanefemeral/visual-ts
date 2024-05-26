import ts from "typescript";
import {
  VariableInfoWithIndex,
  createFunctionCall,
  createVariableWithFunctionCall,
  extractVariables,
  generateCode,
} from "./functions";
import { FunctionInfo } from "@parser/module-parser/types";

const fetchDataFunctionInfo: FunctionInfo = {
  name: "fetchData",
  returnType: "Promise<User[]>",
  parameters: [],
  jsDocComment: "Fetches user data from an API.",
  code: 'export async function fetchData(): Promise<User[]> {\n  const response = await fetch("https://jsonplaceholder.typicode.com/posts");\n  const data: User[] = await response.json();\n  return data;\n}',
  variables: [
    {
      name: "response",
      type: "any",
    },
    {
      name: "data",
      type: "User[]",
    },
  ],
};

const fetchExtraDataFunctionInfo: FunctionInfo = {
  name: "fetchExtraData",
  returnType: "Promise<Todo[]>",
  parameters: [],
  jsDocComment: "Fetches extra data from an API.",
  code: 'export async function fetchExtraData(): Promise<Todo[]> {\n  const response = await fetch("https://jsonplaceholder.typicode.com/todos");\n  const data: Todo[] = await response.json();\n  return data;\n}',
  variables: [
    {
      name: "response",
      type: "any",
    },
    {
      name: "data",
      type: "Todo[]",
    },
  ],
};

const parseDataFunctionInfo: FunctionInfo = {
  name: "parseData",
  returnType: "User[]",
  parameters: [
    {
      name: "data",
      type: "User[]",
    },
  ],
  jsDocComment:
    "Parses user data and modifies the title property to be in uppercase.",
  code: "export function parseData(data: User[]): User[] {\n  return data.map((user) => {\n    return {\n      ...user,\n      title: user.title.toUpperCase(),\n    };\n  });\n}",
  variables: [],
};

const XFunctionInfo: FunctionInfo = {
  name: "X",
  returnType: "string",
  parameters: [],
  jsDocComment: "Dummy function that returns a string",
  code: 'export function X(): string {\n  return "X";\n}',
  variables: [],
};

const YFunctionInfo: FunctionInfo = {
  name: "Y",
  returnType: "Promise<string>",
  parameters: [],
  jsDocComment: "Dummy async function that returns a string after 1 second.",
  code: 'export async function Y(): Promise<string> {\n  await new Promise((resolve) => setTimeout(resolve, 1000));\n  return "Y";\n}',
  variables: [],
};

const ZFunctionInfo: FunctionInfo = {
  name: "Z",
  returnType: "void",
  parameters: [],
  jsDocComment: "Dummy function that returns nothing",
  code: "export function Z(): void {\n  return;\n}",
  variables: [],
};

const functionInfos: FunctionInfo[] = [
  fetchDataFunctionInfo,
  fetchExtraDataFunctionInfo,
  parseDataFunctionInfo,
  XFunctionInfo,
  YFunctionInfo,
  ZFunctionInfo,
];

// Variable Infos
const variableInfos: VariableInfoWithIndex[] = [
  {
    name: "fetchdata",
    type: "User[]",
    index: 0,
  },
  {
    name: "fetchextradata",
    type: "Todo[]",
    index: 1,
  },
  {
    name: "parsedata",
    type: "User[]",
    index: 2,
  },
  {
    name: "x",
    type: "string",
    index: 3,
  },
  {
    name: "y",
    type: "string",
    index: 4,
  },
  {
    name: "z",
    type: "void",
    index: 5,
  },
];

export { functionInfos, variableInfos };

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

    const result = createFunctionCall(functionInfo, [], 0);
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

    const result = createFunctionCall(functionInfo, [], 0);
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

    const result = createFunctionCall(functionInfo, [], 0);
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

    const result = createFunctionCall(functionInfo, [], 0);
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

    const result = createVariableWithFunctionCall(functionInfo, [], 0);
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

    const result = createVariableWithFunctionCall(functionInfo, [], 0);
    const codeString = ts
      .createPrinter()
      .printNode(
        ts.EmitHint.Unspecified,
        result,
        ts.createSourceFile("", "", ts.ScriptTarget.Latest)
      );

    expect(codeString).toBe("const myfunction = myFunction(name, age);");
  });

  it("should create a variable declaration with a unique name if the variable name is already used", () => {
    const functionInfo = functionInfos[0]; // fetchDataFunctionInfo
    const variables = variableInfos;
    const index = functionInfos.length;

    const result = createVariableWithFunctionCall(
      functionInfo,
      variables,
      index
    );
    const codeString = ts
      .createPrinter()
      .printNode(
        ts.EmitHint.Unspecified,
        result,
        ts.createSourceFile("", "", ts.ScriptTarget.Latest)
      );

    expect(codeString).toBe("const fetchdata2 = await fetchData();");
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
