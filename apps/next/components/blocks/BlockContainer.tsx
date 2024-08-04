"use client";
import { CodeBlock } from "@ozhanefe/ts-codegenerator";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";
import { IfBlockView } from "./IfBlockView";
import { WhileBlockView } from "./WhileBlockView";
import { FunctionCallBlockView } from "./FunctionCallBlockView";
import { useBlockEditor } from "@/contexts/BlockEditorContext";

interface BlockContainerProps {
  title: string;
  type: "functionCall" | "if" | "elseif" | "else" | "while";
  children: React.ReactNode;
  isCollapsible?: boolean;
}

interface BlockViewRendererProps {
  block: CodeBlock;
}

export const BlockViewRenderer: React.FC<BlockViewRendererProps> = React.memo(
  ({ block }) => {
    const { setCurrentBlock } = useBlockEditor();

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setCurrentBlock(block);
      },
      [block, setCurrentBlock]
    );

    return (
      <div className="cursor-pointer" onClick={handleClick}>
        {block.blockType === "if" && (
          <IfBlockView
            condition={block.condition}
            thenBlocks={block.thenBlocks.map((b, i) => (
              <BlockViewRenderer key={i} block={b} />
            ))}
            elseIfBlocks={block.elseIfBlocks?.map((elseIf) => ({
              condition: elseIf.condition,
              blocks: elseIf.blocks.map((b, j) => (
                <BlockViewRenderer key={j} block={b} />
              )),
            }))}
            elseBlock={
              block.elseBlock && {
                blocks: block.elseBlock.blocks.map((b, i) => (
                  <BlockViewRenderer key={i} block={b} />
                )),
              }
            }
          />
        )}
        {block.blockType === "while" && (
          <WhileBlockView condition={block.condition}>
            {block.loopBlocks.map((b, i) => (
              <BlockViewRenderer key={i} block={b} />
            ))}
          </WhileBlockView>
        )}
        {block.blockType === "functionCall" && (
          <FunctionCallBlockView block={block} />
        )}
      </div>
    );
  }
);

export const BlockContainer: React.FC<BlockContainerProps> = ({
  title,
  type,
  children,
  isCollapsible = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(true);

  const blockColors = {
    functionCall: "bg-blue-100 border-blue-200",
    if: "bg-green-100 border-green-200",
    elseif: "bg-yellow-100 border-yellow-200",
    else: "bg-orange-100 border-orange-200",
    while: "bg-purple-100 border-purple-200",
    default: "bg-gray-100 border-gray-200",
  };

  const color = blockColors[type] || blockColors.default;

  const handleCollapse = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${color} border-2 rounded-lg p-2 my-1`}>
      <div className="flex items-center justify-between">
        <span className="font-semibold">{title}</span>
        {isCollapsible && (
          <button onClick={handleCollapse} className="focus:outline-none">
            {isOpen ? (
              <ChevronDownIcon width={16} />
            ) : (
              <ChevronRightIcon width={16} />
            )}
          </button>
        )}
      </div>
      {(!isCollapsible || isOpen) && <div className="mt-1">{children}</div>}
    </div>
  );
};
