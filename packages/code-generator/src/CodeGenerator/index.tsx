"use client";

import { CodeViewer } from "@parser/components/file-parser/CodeViewer";
import { Button } from "@ui/button";
import { useCodeGenerator } from "./context";
import SearchDialog from "@parser/components/shared/SearchDialog";
import { SortableFunctionList } from "./SortableFunctionList";

export const CodeGenerator: React.FC = () => {
  const { functions, setFunctions, code, variables } = useCodeGenerator();
  const isEmpty = functions.length === 0;

  const outputWithBreakLine = code.replace(/;/g, ";\n").replace(/{/g, "{\n");

  return (
    <>
      <section className="h-fit p-4 border border-gray-200 border-dashed rounded-md">
        <h1 className="text-2xl font-bold pb-4">Code Generator</h1>
        <SearchDialog
          onAddFunction={(func) => setFunctions([...functions, func])}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <div className="col-span-1">
            <SortableFunctionList />
          </div>
          <div className="col-span-1">
            <CodeViewer fileContent={outputWithBreakLine} />
          </div>
          <div className="col-span-2 mt-auto flex justify-end gap-x-4 items-end">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(outputWithBreakLine);
              }}
              disabled={isEmpty}
            >
              Copy to clipboard
            </Button>
            <Button
              variant="destructive"
              onClick={() => setFunctions([])}
              disabled={isEmpty}
            >
              Clear
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};
