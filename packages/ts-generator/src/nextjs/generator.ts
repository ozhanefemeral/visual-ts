import { ServerActionInfo } from "./types";

export function generateServerAction(info: ServerActionInfo): string {
  const parameters = (info.parameters ?? [])
    .map((param) => `${param.name}: ${param.type}`)
    .join(", ");

  let returnType = info.returnType.replace(/Promise<(.*)>/, "$1");

  returnType = `Promise<${returnType}>`;

  return `"use server";

export async function ${info.name}(${parameters}): ${returnType} {
  // TODO: Implement server action logic
  throw new Error("Not implemented");
}`;
}
