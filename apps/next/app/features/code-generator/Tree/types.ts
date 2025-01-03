import type { MutableRefObject } from "react";
import type { UniqueIdentifier } from "@dnd-kit/core";
import { CodeBlock } from "@ozhanefe/ts-codegenerator";

export interface TreeItem {
  id: UniqueIdentifier;
  children: TreeItem[];
  collapsed?: boolean;
  block: CodeBlock;
  // control flow metadata
  isControlFlowChild?: boolean;
  controlFlowParentId?: UniqueIdentifier;
  blockRole?: "thenBlock" | "elseIfBlock" | "elseBlock" | "loopBlock";
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
