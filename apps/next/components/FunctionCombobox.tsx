"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { FunctionInfo } from "@ozhanefe/ts-codegenerator";

interface ComboboxDemoProps {
  onSelect: (functionInfo: FunctionInfo) => void;
}

export const FunctionCombobox: React.FC<ComboboxDemoProps> = ({ onSelect }) => {
  const { codebaseInfo } = useCodeGenerator();
  const functionInfos = codebaseInfo?.functions;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSelect = (currentValue: string) => {
    const functionInfo = functionInfos?.find(
      (info) => info.name === currentValue
    );
    if (functionInfo) {
      setValue(currentValue);
      setOpen(false);
      onSelect(functionInfo);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? functionInfos?.find((info) => info.name === value)?.name
            : "Select a function"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>Couldn't find it 😔</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {functionInfos?.map((info: FunctionInfo) => (
                <CommandItem
                  key={info.name}
                  value={info.name}
                  onSelect={() => handleSelect(info.name)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === info.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {info.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
