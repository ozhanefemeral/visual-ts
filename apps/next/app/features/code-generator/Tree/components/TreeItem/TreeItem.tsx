import React, { forwardRef, HTMLAttributes } from "react";
import { GripVertical, ArrowDownFromLine, X } from "lucide-react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { cn } from "@ui/utils/tailwind-utils";
import { CodeBlock } from "@ozhanefe/ts-codegenerator";

export interface TreeItemProps
  extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  depth: number;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  indicator?: boolean;
  indentationWidth: number;
  value: UniqueIdentifier;
  block?: CodeBlock;
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

const blockColors = {
  functionCall: "bg-blue-100 border-blue-200",
  if: "bg-green-100 border-green-200",
  "else-if": "bg-yellow-100 border-yellow-200",
  else: "bg-orange-100 border-orange-200",
  while: "bg-purple-100 border-purple-200",
} as const;

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  ({ block, ...props }, ref) => {
    const blockColor = block ? blockColors[block.blockType] : "";
    const blockTitle = getBlockTitle(block);
    const blockContent = getBlockContent(block);

    return (
      <li
        className={cn(
          "list-none box-border -mb-[1px]",
          props.clone && "inline-block pointer-events-none pl-[10px] pt-[5px]",
          props.ghost &&
            props.indicator &&
            "opacity-100 relative z-[1] -mb-[1px]",
          props.ghost && !props.indicator && "opacity-50",
          props.disableSelection && "select-none",
          props.disableInteraction && "pointer-events-none"
        )}
        ref={props.wrapperRef}
        style={{
          paddingLeft: `${props.indentationWidth * props.depth}px`,
          ...props.style,
        }}
      >
        <div
          className={cn(
            "relative flex items-center p-2 border rounded-lg my-1",
            blockColor,
            props.clone &&
              "py-[5px] pr-6 rounded shadow-[0_15px_15px_0_rgba(34,33,81,0.1)]",
            props.ghost &&
              props.indicator &&
              "p-0 h-2 border-[#2389ff] bg-[#56a1f8]"
          )}
          ref={ref}
        >
          <GripVertical className="cursor-grab" {...props.handleProps} />
          {props.onCollapse && (
            <ArrowDownFromLine
              onClick={props.onCollapse}
              className={cn(
                "transition-transform duration-250",
                props.collapsed && "rotate-[-90deg]"
              )}
            />
          )}
          <div className="flex-grow pl-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{blockTitle}</span>
              {blockContent && <span className="ml-2">{blockContent}</span>}
            </div>
          </div>
          {!props.clone && props.onRemove && (
            <X onClick={props.onRemove} className="cursor-pointer" />
          )}
          {props.clone && props.childCount && props.childCount > 1 ? (
            <span className="absolute -top-[10px] -right-[10px] flex items-center justify-center w-6 h-6 rounded-full bg-[#2389ff] text-sm font-semibold text-white">
              {props.childCount}
            </span>
          ) : null}
        </div>
      </li>
    );
  }
);

function getBlockTitle(block?: CodeBlock): string {
  if (!block) return "";

  switch (block.blockType) {
    case "functionCall":
      return block.functionInfo.name;
    case "if":
      return "if";
    case "else-if":
      return "else if";
    case "else":
      return "else";
    case "while":
      return "while";
    default:
      return "";
  }
}

function getBlockContent(block?: CodeBlock): string {
  if (!block) return "";

  switch (block.blockType) {
    case "functionCall":
      return `${block.functionInfo.name}()`;
    case "if":
    case "else-if":
    case "while":
      return block.condition;
    default:
      return "";
  }
}
