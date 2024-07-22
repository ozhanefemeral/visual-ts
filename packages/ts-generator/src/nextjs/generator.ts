// src/nextjs/generator.ts

import { ServerActionInfo } from "./types";

export function generateServerAction(info: ServerActionInfo): string {
  const parameters = (info.parameters ?? [])
    .map((param) => `${param.name}: ${param.type}`)
    .join(", ");

  return `"use server";

export async function ${info.name}(${parameters}): Promise<${info.returnType}> {
  // TODO: Implement server action logic
  throw new Error("Not implemented");
}`;
}
