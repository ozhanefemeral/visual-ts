import { ModuleInfo } from "@parser/components/file-parser/ModuleInfo";
import { Separator } from "@ui/separator";

export default function ModuleParserPage() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h1 className="text-2xl font-bold">Module Parser </h1>
        <p>
          Module Parser is a tool to extract information from a <code>.ts</code>{" "}
          file. It can extract functions, types, and interfaces from a file.
          Passing file path as a prop to the <code>ModuleInfo</code> component
          will display all the functions and types in the file. Any JSDoc
          comment will be displayed as a description.
        </p>
      </div>
      <Separator />
      <ModuleInfo filePath="app/actions.ts" />
    </div>
  );
}
