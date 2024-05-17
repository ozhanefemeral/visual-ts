import fs from "fs";
import path from "path";

export function readFileContent(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

export function determineFileType(filePath: string): string {
  return path.extname(filePath);
}

export function getFileName(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}
