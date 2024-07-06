import { CodeGenerator } from "@code-generator/CodeGenerator";

export default function CodeGeneratorPage() {
  return (
    <div className="lg:flex w-full">
      <div className="flex-auto p-3">
        <CodeGenerator />
      </div>
    </div>
  );
}
