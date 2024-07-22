import { Project } from "ts-morph";
import {
  analyzeNextjsSourceFiles,
  generateServerAction,
  ServerActionInfo,
} from "../index";

describe("Next.js functionality", () => {
  let project: Project;

  beforeEach(() => {
    project = new Project({ useInMemoryFileSystem: true });
  });

  describe("analyzeNextjsSourceFiles", () => {
    it("should correctly identify and parse server actions", () => {
      const serverActionCode = `
        "use server";
        
        export async function submitForm(data: FormData) {
          // Server action logic
        }

        export async function deleteItem(id: string) {
          // Delete item logic
        }
      `;

      const sourceFile = project.createSourceFile(
        "app/actions.ts",
        serverActionCode
      );

      const result = analyzeNextjsSourceFiles([sourceFile]);

      expect(result.serverActions).toHaveLength(2);
      expect(result.serverActions[0]?.name).toBe("submitForm");
      expect(result.serverActions[1]?.name).toBe("deleteItem");
    });

    it("should not identify non-server actions", () => {
      const regularCode = `
        export function regularFunction() {
          // Regular function logic
        }
      `;

      const sourceFile = project.createSourceFile(
        "app/regular.ts",
        regularCode
      );

      const result = analyzeNextjsSourceFiles([sourceFile]);

      expect(result.serverActions).toHaveLength(0);
    });
  });

  describe("generateServerAction", () => {
    it("should generate correct server action code", () => {
      const serverActionInfo: ServerActionInfo = {
        name: "testAction",
        returnType: "Promise<string>", // This could be 'string' or 'Promise<string>', the function should handle both
        parameters: [
          { name: "data", type: "FormData" },
          { name: "userId", type: "string" },
        ],
        filePath: "app/actions.ts",
      };

      const generatedCode = generateServerAction(serverActionInfo);

      expect(generatedCode).toContain('"use server";');
      expect(generatedCode).toContain(
        "export async function testAction(data: FormData, userId: string): Promise<string>"
      );
      expect(generatedCode).toContain("// TODO: Implement server action logic");
      expect(generatedCode).toContain('throw new Error("Not implemented");');
    });

    it("should handle non-Promise return types", () => {
      const serverActionInfo: ServerActionInfo = {
        name: "testAction",
        returnType: "void",
        parameters: [],
        filePath: "app/actions.ts",
      };

      const generatedCode = generateServerAction(serverActionInfo);

      expect(generatedCode).toContain(
        "export async function testAction(): Promise<void>"
      );
    });
  });
});
