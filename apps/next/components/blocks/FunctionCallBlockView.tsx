"use client";
import React from 'react';
import { FunctionCallBlock } from '@ozhanefe/ts-codegenerator';

interface FunctionCallBlockViewProps {
  block: FunctionCallBlock,
}

const parametersToString = (parameters: FunctionCallBlock["parameters"]) => {
  if (!parameters) return "";
  return parameters.map((param) => param.name).join(", ");
}

const functionTitle = (func: FunctionCallBlock) => {
  return `${func.functionInfo.name}(${parametersToString(func.functionInfo.parameters)})`
}

export const FunctionCallBlockView: React.FC<FunctionCallBlockViewProps> = ({block}) => {
  return (
    <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-2 my-1">
      <div className="font-semibold">{functionTitle(block)}</div>
      <p>{block.returnVariable?.name}: {block.returnVariable?.type}</p>
    </div>
  )
}