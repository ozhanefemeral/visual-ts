import path from "path";
import { CodeGenerator } from "./CodeGenerator";
import { SearchDialog } from "@/components/SearchDialog";
import { scanCodebase } from "@ozhanefe/ts-codegenerator";
import { HelpDialog, LoadDialog } from "./Dialogs";
import { SortableTree } from "./Tree/SortableTree";

export default function CodeGeneratorPage() {
  const projectPath = path.join(process.cwd());
  const codebaseInfo = scanCodebase(projectPath);

  return (
    <main className="p-8 w-full">
      {/* <h1 className="text-3xl font-bold mb-6">Code Generator</h1>
      <div className="flex gap-4 mb-4">
        <SearchDialog />
        <LoadDialog />
        <HelpDialog />
      </div>
      <CodeGenerator codebaseInfo={codebaseInfo} /> */}
      <SortableTree />
    </main>
  );
}
