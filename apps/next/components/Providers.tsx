"use client";
import { DndContext } from "@dnd-kit/core";
import { CodeGeneratorProvider } from "@/contexts/CodeGeneratorContext";
import { SavedFunctionsProvider } from "@/contexts/SavedFunctionsContext";
import { BlockEditorProvider } from "@/contexts/BlockEditorContext";

export const Providers: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <DndContext>
      <CodeGeneratorProvider>
        <SavedFunctionsProvider>
          <BlockEditorProvider>{children}</BlockEditorProvider>
        </SavedFunctionsProvider>
      </CodeGeneratorProvider>
    </DndContext>
  );
};
