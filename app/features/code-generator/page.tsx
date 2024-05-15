import { CodeGenerator } from "@/components/CodeGenerator";
import { ProjectFunctions } from "@/components/project-functions";
import React from "react";

export default function CodeGeneratorPage() {
  return (
    <div className="lg:flex w-full">
      <div className="hidden lg:block md:relative scrollable-container flex-none p-3 lg:w-60 xl:w-72">
        <ProjectFunctions />
      </div>
      <div className="flex-auto p-3">
        <CodeGenerator />
      </div>
    </div>
  );
}
