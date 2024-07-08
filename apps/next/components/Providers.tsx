"use client";
import { DndContext } from "@dnd-kit/core";
import { CodeGeneratorProvider } from "@code-generator/CodeGenerator/context";
import { SavedFunctionsProvider } from "@code-generator/CodeGenerator/saved-functions.context";

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
