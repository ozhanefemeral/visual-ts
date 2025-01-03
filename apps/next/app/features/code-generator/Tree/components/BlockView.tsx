import React from "react";
import { CodeBlock } from "@ozhanefe/ts-codegenerator";
import { BlockContainer } from "@/components/blocks/BlockContainer";

interface BlockViewProps {
  block: CodeBlock;
}

export const BlockView: React.FC<BlockViewProps> = ({ block }) => {
  switch (block.blockType) {
    case "if":
      return (
        <BlockContainer title="if" type="if">
          {block.condition}
        </BlockContainer>
      );
    case "else-if":
      return (
        <BlockContainer title="else if" type="elseif">
          {block.condition}
        </BlockContainer>
      );
    case "else":
      return (
        <BlockContainer title="else" type="else">
          else
        </BlockContainer>
      );
    case "while":
      return (
        <BlockContainer title="while" type="while">
          {block.condition}
        </BlockContainer>
      );
    case "functionCall":
      return (
        <BlockContainer title={block.functionInfo.name} type="functionCall">
          {block.functionInfo.name}()
        </BlockContainer>
      );
    default:
      return null;
  }
};
