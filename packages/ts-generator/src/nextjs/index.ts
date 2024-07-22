// Named exports for types
export type { NextCodebaseInfo, ServerActionInfo } from "./types";

// Named exports for functions
export { scanNextjsCodebase } from "./scanner";
export { generateServerAction } from "./generator";

// Optionally, you can also include a convenience export
export * as NextJS from "./";
