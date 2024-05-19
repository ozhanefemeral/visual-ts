import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@ui/card";
import { ComponentInfo } from "./ComponentInfo";
import { ModuleInfo } from "./ModuleInfo";
import { determineFileType, getFileName, FileParserProps } from "@repo/parser";

export const FileParser: React.FC<FileParserProps> = ({ filePath }) => {
  const fileType = determineFileType(filePath);
  const fileName = getFileName(filePath);

  const isSupportedFileType = [".ts", ".tsx"].includes(fileType);

  if (isSupportedFileType) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {fileName}
            {fileType}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fileType === ".ts" ? (
            <ModuleInfo filePath={filePath} />
          ) : (
            <ComponentInfo filePath={filePath} />
          )}
        </CardContent>
        <CardFooter>
          <p>
            <span className="font-bold">File Path:</span> {filePath}
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      <p>File type not supported. Please provide a .ts or .tsx file.</p>
      <p>{filePath}</p>
    </div>
  );
};
