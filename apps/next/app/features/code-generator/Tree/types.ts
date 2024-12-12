import type { MutableRefObject } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { CodeBlock } from "@ozhanefe/ts-codegenerator";

export interface TreeItem {
  id: UniqueIdentifier;
  children: TreeItem[];
  collapsed?: boolean;
  // if block is null, it is the root
  block: CodeBlock | null;
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: UniqueIdentifier | null;
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
