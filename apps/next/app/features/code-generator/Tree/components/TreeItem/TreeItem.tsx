import React, { forwardRef, HTMLAttributes } from "react";
import { GripVertical, ArrowDownFromLine, X } from "lucide-react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { cn } from "@ui/utils/tailwind-utils";

export interface Props extends Omit<HTMLAttributes<HTMLLIElement>, "id"> {
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
  onCollapse?(): void;
  onRemove?(): void;
  wrapperRef?(node: HTMLLIElement): void;
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      value,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    return (
      <li
        className={cn(
          "list-none box-border -mb-[1px]",
          clone && "inline-block pointer-events-none pl-[10px] pt-[5px]",
          ghost && indicator && "opacity-100 relative z-[1] -mb-[1px]",
          ghost && !indicator && "opacity-50",
          disableSelection && "select-none",
          disableInteraction && "pointer-events-none"
        )}
        ref={wrapperRef}
        style={{
          paddingLeft: `${indentationWidth * depth}px`,
          ...style,
        }}
        {...props}
      >
        <div
          className={cn(
            "relative flex items-center py-[10px] px-[10px] bg-white border border-[#dedede] text-[#222] box-border",
            clone &&
              "py-[5px] pr-6 rounded shadow-[0_15px_15px_0_rgba(34,33,81,0.1)]",
            ghost && indicator && "p-0 h-2 border-[#2389ff] bg-[#56a1f8]"
          )}
          ref={ref}
        >
          <GripVertical className="cursor-grab" {...handleProps} />
          {onCollapse && (
            <ArrowDownFromLine
              onClick={onCollapse}
              className={cn(
                "transition-transform duration-250",
                collapsed && "rotate-[-90deg]"
              )}
            />
          )}
          <span className="flex-grow pl-2 whitespace-nowrap overflow-hidden text-ellipsis">
            {value}
          </span>
          {!clone && onRemove && (
            <X onClick={onRemove} className="cursor-pointer" />
          )}
          {clone && childCount && childCount > 1 ? (
            <span className="absolute -top-[10px] -right-[10px] flex items-center justify-center w-6 h-6 rounded-full bg-[#2389ff] text-sm font-semibold text-white">
              {childCount}
            </span>
          ) : null}
        </div>
      </li>
    );
  }
);
