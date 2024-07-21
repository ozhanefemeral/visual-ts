"use client";
import { DndContext } from "@dnd-kit/core";
import { CodeGeneratorProvider } from "@/contexts/CodeGeneratorContext";
import { SavedFunctionsProvider } from "@/contexts/SavedFunctionsContext";

export const Providers: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <DndContext>
      <CodeGeneratorProvider>
        <SavedFunctionsProvider>{children}</SavedFunctionsProvider>
      </CodeGeneratorProvider>
    </DndContext>
  );
};
