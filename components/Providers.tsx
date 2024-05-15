"use client";
import { DndContext } from "@dnd-kit/core";
import { CodeGeneratorProvider } from "./CodeGenerator/context";

export const Providers: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <DndContext>
      <CodeGeneratorProvider>{children}</CodeGeneratorProvider>
    </DndContext>
  );
};
