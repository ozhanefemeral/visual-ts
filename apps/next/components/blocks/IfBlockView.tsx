"use client";
import React from 'react';
import { BlockContainer } from './BlockContainer';

interface IfBlockViewProps {
  condition: string;
  thenBlocks: React.ReactNode;
  elseIfBlocks?: { condition: string; blocks: React.ReactNode }[];
  elseBlock?: { blocks: React.ReactNode };
}

export const IfBlockView: React.FC<IfBlockViewProps> = ({ condition, thenBlocks, elseIfBlocks, elseBlock }) => (
  <BlockContainer type="if" title={`If: ${condition}`} isCollapsible>
    <div className="pl-2 border-l-2 border-green-300">
      <div className="mb-1">
        <span className="font-semibold">Then:</span>
        {thenBlocks}
      </div>
      {elseIfBlocks && elseIfBlocks.map((elseIf, index) => (
        <BlockContainer key={index} type="elseif" title={`Else If: ${elseIf.condition}`} isCollapsible>
          {elseIf.blocks}
        </BlockContainer>
      ))}
      {elseBlock && (
        <div className="mb-1 bg-orange-100 border-2 border-orange-300 rounded-lg p-2">
          <span className="font-semibold">Else:</span>
          {elseBlock.blocks}
        </div>
      )}
    </div>
  </BlockContainer>
);