import * as path from "path";
import { scanCodebase } from "../codebase-scanner";
import { CodebaseInfo } from "../types";

describe("Codebase Scanner", () => {
  it("should scan codebase", () => {
    const mockCodebasePath = path.resolve(__dirname, "scanner-mock-codebase");
    const result = scanCodebase(mockCodebasePath);

    const expectedCodebaseInfo: CodebaseInfo = {
      functions: [
        {
          name: "getRandomNumber",
          parameters: [],
          returnType: "number",
        },
        {
          name: "getRandomName",
          parameters: [],
          returnType: "string",
        },
      ],
      types: [
        {
          name: "User",
          properties: [
            {
              name: "name",
              type: "string",
            },
            {
              name: "id",
              type: "number",
            },
          ],
        },
      ],
    };

    expect(result).toEqual(expectedCodebaseInfo);
  });
});
