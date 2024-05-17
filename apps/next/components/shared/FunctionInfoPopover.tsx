"use client";

import { CodeViewer } from "../file-parser/CodeViewer";
import { FunctionInfo } from "@repo/parser";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
