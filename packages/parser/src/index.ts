export { parseComponentFromFile } from "./component-parser";
export type { ButtonInfo, ComponentInfoFields } from "./component-parser/types";
export {
  updateButtons,
  updateComponentFunctions,
  updateInterfaces,
  updateStateVariables,
} from "./component-parser/utils";

export {
  getFunctionInfoFromNode,
  parseFunctionsFromFile,
} from "./module-parser";
export type {
  FileParserProps,
  FunctionInfo,
  ModuleInfoFields,
  VariableInfo,
} from "./module-parser/types";
export { getFunctionVariables } from "./module-parser/utils";

export {
  determineFileType,
  getFileName,
  readFileContent,
} from "./utils/file-utils";
export { createTypeChecker } from "./utils/typescript-utils";
export {
  assignColorsToElements,
  generateRandomColorFromStr,
} from "./utils/color-utils";
export {
  CodebaseSearcher,
  initializeSearcher,
} from "./utils/codebase-searcher";
export type { SearchResult } from "./utils/codebase-searcher";
