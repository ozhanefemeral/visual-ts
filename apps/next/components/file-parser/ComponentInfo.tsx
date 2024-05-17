import {
  getFileName,
  readFileContent,
  updateButtons,
  updateComponentFunctions,
  updateStateVariables,
} from "@repo/parser";
import { ComponentInfoFields, FileParserProps, FunctionInfo } from "./types";

function getComponentInfo({ filePath }: FileParserProps): ComponentInfoFields {
  const fileContent = readFileContent(filePath);
  const fileName = getFileName(filePath);

  const stateVariables: string[] = [];
  const functions: FunctionInfo[] = [];
  const buttons: { label: string; handler: string }[] = [];

  const lines = fileContent.split("\n");
  // Pass references to the functions to update the state variables, functions, and buttons
  for (const line of lines) {
    updateComponentFunctions(line, functions);
    updateStateVariables(line, stateVariables);
    updateButtons(line, buttons, lines);
  }

  return {
    fileName,
    stateVariables,
    functions,
    buttons,
  };
}

export const ComponentInfo: React.FC<FileParserProps> = ({ filePath }) => {
  const componentInfo = getComponentInfo({ filePath });

  return (
    <section>
      <ul className="list-disc flex flex-col gap-y-2">
        <li>
          <p className="font-bold">File Name:</p>
          {componentInfo.fileName}
        </li>
        <li>
          <p className="font-bold">State Variables:</p>
          {componentInfo.stateVariables.join(", ")}
        </li>
        <li>
          <p className="font-bold">Functions:</p>
          <ul className="list-disc ml-4">
            {componentInfo.functions.map((func) => (
              <li key={`func-${func.name}`} className="mb-1">
                <span className="font-bold">{func.name}</span>:{" "}
                {func.returnType}
              </li>
            ))}
          </ul>
        </li>
        <li>
          <p className="font-bold">Buttons:</p>
          <ul className="list-disc ml-4">
            {componentInfo.buttons.map((button) => (
              <li key={`btn-${button.label}`} className="mb-1">
                <span className="font-bold">Label:</span> {button.label}
                <br />
                <span className="font-bold">Handler:</span> {button.handler}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </section>
  );
};
