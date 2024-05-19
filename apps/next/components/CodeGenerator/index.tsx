"use client";

import { useDndMonitor, useDroppable } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { CodeViewer } from "../file-parser/CodeViewer";
import { FunctionInfo } from "@repo/parser";
import { Button } from "@ui/button";
import { Separator } from "@ui/separator";
import { useCodeGenerator } from "./context";

export function generateCodeFromFunction(functionInfo: FunctionInfo): string {
  let code = "";

  const variableName = functionInfo.name.toLowerCase();
  const parameters = functionInfo.parameters;
  const isAsync = functionInfo.returnType?.includes("Promise");

  code += `let ${variableName} = ${isAsync ? "await" : ""} ${functionInfo.name}(`;

  code += ");";

  return code;
}

export function generateCode(functionInfos: FunctionInfo[]): string {
  let code = "";

  code += `function generatedFunction() { \n`;

  const isAsync = functionInfos.some((f) => f.returnType?.includes("Promise"));

  if (isAsync) {
    code = `async ${code}`;
  }

  for (const functionInfo of functionInfos) {
    code += generateCodeFromFunction(functionInfo) + "\n";
  }

  code += `} \n`;
  return code;
}

const FunctionDropZone: React.FC = () => {
  const { functions, setFunctions } = useCodeGenerator();
  const { isOver, setNodeRef, over, active } = useDroppable({
    id: "droppable",
  });
  const style = {
    border: active
      ? "4px dashed green"
      : isOver
        ? "4px solid green"
        : "4px dashed black",
    backgroundColor: isOver ? "rgba(0, 255, 0, 0.25)" : "transparent",
  };

  useDndMonitor({
    onDragEnd: (event) => {
      const { func } = event.active?.data?.current || {};
      if (event.over?.id === "droppable" && func) {
        setFunctions([...functions, func]);
      }
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 border border-gray-200 border-dashed rounded-md relative max-h-96 overflow-y-auto overfloy-x-hidden"
    >
      {functions.map((func, index) => (
        <>
          <p key={index} className="p-2 mb-2 flex justify-between items-center">
            {func.name}
            <Button
              variant="link"
              onClick={() => setFunctions(functions.filter((f) => f !== func))}
            >
              Remove
            </Button>
          </p>
          <Separator />
        </>
      ))}
    </div>
  );
};

export const CodeGenerator: React.FC = () => {
  const { functions, setFunctions } = useCodeGenerator();
  const [output, setOutput] = useState<string>("");
  const isEmpty = functions.length === 0;

  useEffect(() => {
    setOutput(generateCode(functions));
  }, [functions, setFunctions]);

  return (
    <section className="h-fit p-4 border border-gray-200 border-dashed rounded-md">
      <h1 className="text-2xl font-bold pb-4">Code Generator</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1">
          <FunctionDropZone />
        </div>
        <div className="col-span-1">
          <CodeViewer fileContent={output} />
        </div>
        <div className="col-span-2 mt-auto flex justify-end gap-x-4 items-end">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(output);
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
  );
};
