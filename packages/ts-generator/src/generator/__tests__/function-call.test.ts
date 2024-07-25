import { FunctionInfo } from "../../types/common";
import { CodeGeneratorState } from "../../types/generator";
import { createFunctionCallBlock } from "../blocks/function-call";

describe("Function Call Block Generator", () => {
  let initialState: CodeGeneratorState;
  let functionInfo: FunctionInfo;

  beforeEach(() => {
    initialState = {
      blocks: [],
      variables: [],
      isAsync: false,
    };
    functionInfo = {
      name: "testFunction",
      returnType: "string",
      parameters: [
        { name: "param1", type: "number" },
        { name: "param2", type: "boolean" },
      ],
    };
  });

  test("generates function call block successfully", () => {
    const result = createFunctionCallBlock(functionInfo, initialState);

    expect(result).toBeDefined();
    expect(result.blockType).toBe("functionCall");
    expect(result.functionInfo).toEqual(functionInfo);
    expect(result.isAsync).toBe(false);
    expect(result.index).toBe(0);
    expect(result.returnVariable).toBeDefined();
    expect(result.returnVariable?.name).toBe("testfunction");
    expect(result.returnVariable?.type).toBe("string");
  });

  test("generates function call block with parameters based on state variables", () => {
    const stateWithVariables: CodeGeneratorState = {
      ...initialState,
      variables: [
        { name: "existingNumber", type: "number", index: 0 },
        { name: "existingBoolean", type: "boolean", index: 1 },
      ],
    };

    const result = createFunctionCallBlock(functionInfo, stateWithVariables);

    expect(result.parameters).toEqual(functionInfo.parameters);
    // The actual parameter matching would happen in createFunctionCall,
    // which is not directly tested here. You might want to add a separate
    // test for that function if it's exported.
  });

  test("updates state correctly after creating function call block", () => {
    const result = createFunctionCallBlock(functionInfo, initialState);

    expect(initialState.blocks.length).toBe(1);
    expect(initialState.blocks[0]).toEqual(result);
    expect(initialState.variables.length).toBe(1);
    expect(initialState.variables[0]).toEqual(result.returnVariable);
  });

  test("generates async function call block for Promise return type", () => {
    const asyncFunctionInfo: FunctionInfo = {
      ...functionInfo,
      returnType: "Promise<string>",
    };

    const result = createFunctionCallBlock(asyncFunctionInfo, initialState);

    expect(result.isAsync).toBe(true);
    expect(result.returnVariable?.type).toBe("string");
  });

  test("generates unique variable names", () => {
    const stateWithExistingVariable: CodeGeneratorState = {
      ...initialState,
      variables: [{ name: "testfunction", type: "string", index: 0 }],
    };

    const result = createFunctionCallBlock(
      functionInfo,
      stateWithExistingVariable
    );

    expect(result.returnVariable?.name).toBe("testfunction2");
  });
});
