"use client";
import React from 'react';
import { BlockContainer } from './BlockContainer';

interface WhileBlockViewProps {
  condition: string;
  children: React.ReactNode;
}

export const WhileBlockView: React.FC<WhileBlockViewProps> = ({ condition, children }) => (
  <BlockContainer type="while" title={`While: ${condition}`} isCollapsible>
    <div className="pl-2 border-l-2 border-purple-300">
      {children}
    </div>
  </BlockContainer>
);