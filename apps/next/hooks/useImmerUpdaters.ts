import { useCallback } from "react";
import { produce } from "immer";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import {
  CodeBlock,
  FunctionCallBlock,
  IfBlock,
  WhileLoopBlock,
} from "@ozhanefe/ts-codegenerator";

const isIfBlock = (block: CodeBlock): block is IfBlock =>
  block.blockType === "if";
const isWhileBlock = (block: CodeBlock): block is WhileLoopBlock =>
  block.blockType === "while";

const updateBlockRecursive = (
  blocks: CodeBlock[],
  blockIndex: number,
  recipe: (draft: CodeBlock) => void
): boolean => {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (block.index === blockIndex) {
      recipe(block);
      return true;
    }

    if (isIfBlock(block)) {
      if (updateBlockRecursive(block.thenBlocks, blockIndex, recipe))
        return true;
      if (
        block.elseBlock &&
        updateBlockRecursive([block.elseBlock], blockIndex, recipe)
      )
        return true;
      if (block.elseIfBlocks) {
        for (const elseIfBlock of block.elseIfBlocks) {
          if (updateBlockRecursive(elseIfBlock.blocks, blockIndex, recipe))
            return true;
        }
      }
    }

    if (isWhileBlock(block)) {
      if (updateBlockRecursive(block.loopBlocks, blockIndex, recipe))
        return true;
    }
  }
  return false;
};

export const useImmerBlockUpdater = () => {
  const { setState } = useCodeGenerator();

  return useCallback(
    (blockIndex: number, recipe: (draft: CodeBlock) => void) => {
      setState(
        produce((draft) => {
          updateBlockRecursive(draft.blocks, blockIndex, recipe);
        })
      );
    },
    [setState]
  );
};

export const useFunctionBlockUpdater = () => {
  const updateBlock = useImmerBlockUpdater();

  const updateFunctionBlock = useCallback(
    (block: FunctionCallBlock, recipe: (draft: FunctionCallBlock) => void) => {
      updateBlock(block.index, (draft) => recipe(draft as FunctionCallBlock));
    },
    [updateBlock]
  );

  return updateFunctionBlock;
};

export const useIfBlockUpdater = () => {
  const updateBlock = useImmerBlockUpdater();

  const updateIfBlock = useCallback(
    (block: IfBlock, recipe: (draft: IfBlock) => void) => {
      updateBlock(block.index, (draft) => recipe(draft as IfBlock));
    },
    [updateBlock]
  );

  return updateIfBlock;
};

export const useWhileBlockUpdater = () => {
  const updateBlock = useImmerBlockUpdater();

  const updateWhileBlock = useCallback(
    (block: WhileLoopBlock, recipe: (draft: WhileLoopBlock) => void) => {
      updateBlock(block.index, (draft) => recipe(draft as WhileLoopBlock));
    },
    [updateBlock]
  );

  return updateWhileBlock;
};
