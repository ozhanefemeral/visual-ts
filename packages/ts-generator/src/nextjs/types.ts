import { FunctionInfo } from "../types";

export interface ServerActionInfo extends FunctionInfo {
  filePath: string;
}

export interface NextCodebaseInfo {
  serverActions: ServerActionInfo[];
}
