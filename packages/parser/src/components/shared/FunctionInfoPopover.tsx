"use client";

import { CodeViewer } from "@parser/components/file-parser/CodeViewer";
import { FunctionInfo } from "@parser/module-parser/types";

import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";

export const FunctionInfoPopover: React.FC<{
  func: FunctionInfo;
}> = ({ func }) => {
  return (
    <Popover>
      <PopoverTrigger>ℹ️</PopoverTrigger>
      <PopoverContent className="w-full p-4">
        <h2 className="text-lg font-bold">
          {func.name}: {func.returnType}
        </h2>
        <CodeViewer fileContent={func.code!} />
      </PopoverContent>
    </Popover>
  );
};
