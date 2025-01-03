"use client";
import {
  Announcements,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MeasuringStrategy,
  Modifier,
  PointerSensor,
  UniqueIdentifier,
  closestCenter,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useBlockEditor } from "@/contexts/BlockEditorContext";
import { useCodeGenerator } from "@/contexts/CodeGeneratorContext";
import { CSS } from "@dnd-kit/utilities";
import { SortableTreeItem } from "./components";
import { sortableTreeKeyboardCoordinates } from "./keyboardCoordinates";
import type {
  FlattenedItem,
  SensorContext,
  TreeItems,
  TreeItem,
} from "./types";
import {
  buildTree,
  flattenTree,
  getChildCount,
  getProjection,
  removeChildrenOf,
  removeItem,
  setProperty,
} from "./utilities";
import {
  CodeBlock,
  ElseBlock,
  ElseIfBlock,
  IfBlock,
  WhileLoopBlock,
} from "@ozhanefe/ts-codegenerator";

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: "ease-out",
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

interface Props {
  indentationWidth?: number;
  indicator?: boolean;
  removable?: boolean;
}

export function SortableTree({
  indicator = false,
  indentationWidth = 50,
  removable,
}: Props) {
  const { state, setState } = useCodeGenerator();
  const { setCurrentBlock, currentBlock } = useBlockEditor();

  const buildTreeItems = (blocks: CodeBlock[]): TreeItems => {
    const buildTreeItemsRecursive = (
      blocks: CodeBlock[],
      parentId?: string,
      blockRole?: TreeItem["blockRole"]
    ): TreeItems => {
      return blocks.map((block) => {
        const treeItem: TreeItem = {
          id: block.index.toString(),
          children: [],
          block,
          ...(parentId && {
            isControlFlowChild: true,
            controlFlowParentId: parentId,
            blockRole,
          }),
        };

        switch (block.blockType) {
          case "if": {
            const ifBlock = block as IfBlock;
            // handle then blocks
            treeItem.children.push(
              ...buildTreeItemsRecursive(
                ifBlock.thenBlocks,
                block.index.toString(),
                "thenBlock"
              )
            );

            // handle else-if blocks
            ifBlock.elseIfBlocks?.forEach((elseIf) => {
              const elseIfItem: TreeItem = {
                id: elseIf.index.toString(),
                children: buildTreeItemsRecursive(
                  elseIf.blocks || [],
                  elseIf.index.toString(),
                  "elseIfBlock"
                ),
                block: elseIf,
                isControlFlowChild: true,
                controlFlowParentId: block.index.toString(),
                blockRole: "elseIfBlock",
              };
              treeItem.children.push(elseIfItem);
            });

            // handle else block
            if (ifBlock.elseBlock) {
              const elseItem: TreeItem = {
                id: ifBlock.elseBlock.index.toString(),
                children: buildTreeItemsRecursive(
                  ifBlock.elseBlock.blocks || [],
                  ifBlock.elseBlock.index.toString(),
                  "elseBlock"
                ),
                block: ifBlock.elseBlock,
                isControlFlowChild: true,
                controlFlowParentId: block.index.toString(),
                blockRole: "elseBlock",
              };
              treeItem.children.push(elseItem);
            }
            break;
          }
          case "while": {
            const whileBlock = block as WhileLoopBlock;
            treeItem.children.push(
              ...buildTreeItemsRecursive(
                whileBlock.loopBlocks,
                block.index.toString(),
                "loopBlock"
              )
            );
            break;
          }
        }

        return treeItem;
      });
    };

    return buildTreeItemsRecursive(blocks);
  };

  const [items, setItems] = useState<TreeItems>(() =>
    buildTreeItems(state.blocks)
  );

  useEffect(() => {
    setItems(buildTreeItems(state.blocks));
  }, [state.blocks]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{
    parentId: UniqueIdentifier | null;
    overId: UniqueIdentifier;
  } | null>(null);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);

    const collapsedItems = flattenedTree.reduce<UniqueIdentifier[]>(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeId != null ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth
        )
      : null;
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });
  const [coordinateGetter] = useState(() =>
    sortableTreeKeyboardCoordinates(sensorContext, indicator, indentationWidth)
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  );

  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems]
  );
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`;
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement("onDragMove", active.id, over?.id);
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement("onDragOver", active.id, over?.id);
    },
    onDragEnd(event) {
      const announcement = getMovementAnnouncement(
        "onDragEnd",
        event.active.id,
        event.over?.id
      );
      handleDragEnd(event as DragEndEvent);
      return announcement;
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

  // console.log(state.blocks);

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map(({ id, children, collapsed, depth }) => (
          <SortableTreeItem
            key={id}
            id={id}
            value={id}
            depth={id === activeId && projected ? projected.depth : depth}
            indentationWidth={indentationWidth}
            indicator={indicator}
            collapsed={Boolean(collapsed && children.length)}
            onRemove={removable ? () => handleRemove(id) : undefined}
            block={flattenedItems.find((item) => item.id === id)?.block!}
          />
        ))}
        {createPortal(
          <DragOverlay
            dropAnimation={dropAnimationConfig}
            modifiers={indicator ? [adjustTranslate] : undefined}
          >
            {activeId && activeItem ? (
              <SortableTreeItem
                id={activeId}
                depth={activeItem.depth}
                clone
                childCount={getChildCount(items, activeId) + 1}
                value={activeId.toString()}
                indentationWidth={indentationWidth}
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </SortableContext>
    </DndContext>
  );

  function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
    setActiveId(activeId);
    setOverId(activeId);

    const activeItem = flattenedItems.find(({ id }) => id === activeId);

    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parentId,
        overId: activeId,
      });
    }

    document.body.style.setProperty("cursor", "grabbing");
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null);
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty("cursor", "");
  }

  function handleRemove(id: UniqueIdentifier) {
    const itemToRemove = flattenedItems.find((item) => item.id === id);
    if (
      itemToRemove?.block &&
      currentBlock?.index === itemToRemove.block.index
    ) {
      setCurrentBlock(null);
    }

    setItems((items) => removeItem(items, id));

    setState({
      ...state,
      blocks: state.blocks.filter((block) => block.index.toString() !== id),
    });
  }

  function getMovementAnnouncement(
    eventName: string,
    activeId: UniqueIdentifier,
    overId?: UniqueIdentifier
  ) {
    if (overId && projected) {
      if (eventName !== "onDragEnd") {
        if (
          currentPosition &&
          projected.parentId === currentPosition.parentId &&
          overId === currentPosition.overId
        ) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === "onDragEnd" ? "dropped" : "moved";
      const nestedVerb = eventName === "onDragEnd" ? "dropped" : "nested";

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling: FlattenedItem | undefined = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            const parentId: UniqueIdentifier | null = previousSibling.parentId;
            previousSibling = sortedItems.find(({ id }) => id === parentId);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
          }
        }
      }

      return announcement;
    }

    return;
  }

  // helper to rebuild blocks from tree
  function rebuildBlocksFromTree(items: TreeItems): CodeBlock[] {
    return items.map((item) => {
      const block = { ...item.block };

      if (block.blockType === "if") {
        const ifBlock = block as IfBlock;
        const children = item.children || [];

        // recursively rebuild then blocks, maintaining order based on flattened index
        ifBlock.thenBlocks = children
          .filter((c) => c.blockRole === "thenBlock")
          .sort(
            (a, b) =>
              flattenedItems.findIndex((i) => i.id === a.id) -
              flattenedItems.findIndex((i) => i.id === b.id)
          )
          .map((c) => {
            const thenBlock = { ...c.block };
            if (c.children.length > 0 && thenBlock.blockType === "if") {
              const nestedChildren = rebuildBlocksFromTree([c]);
              return nestedChildren[0];
            }
            return thenBlock;
          });

        // recursively rebuild else-if blocks, maintaining order based on flattened index
        ifBlock.elseIfBlocks = children
          .filter((c) => c.blockRole === "elseIfBlock")
          .sort(
            (a, b) =>
              flattenedItems.findIndex((i) => i.id === a.id) -
              flattenedItems.findIndex((i) => i.id === b.id)
          )
          .map((c) => {
            const elseIfBlock = { ...c.block } as ElseIfBlock;
            if (c.children.length > 0) {
              elseIfBlock.blocks = rebuildBlocksFromTree(c.children);
            }
            return elseIfBlock;
          });

        // recursively rebuild else block
        const elseChild = children.find((c) => c.blockRole === "elseBlock");
        if (elseChild) {
          const elseBlock = { ...elseChild.block } as ElseBlock;
          if (elseChild.children.length > 0) {
            elseBlock.blocks = rebuildBlocksFromTree(elseChild.children);
          }
          ifBlock.elseBlock = elseBlock;
        } else {
          ifBlock.elseBlock = undefined;
        }
      } else if (block.blockType === "while") {
        const whileBlock = block as WhileLoopBlock;
        whileBlock.loopBlocks = (item.children || [])
          .filter((c) => c.blockRole === "loopBlock")
          .sort(
            (a, b) =>
              flattenedItems.findIndex((i) => i.id === a.id) -
              flattenedItems.findIndex((i) => i.id === b.id)
          )
          .map((c) => {
            const loopBlock = { ...c.block };
            if (c.children.length > 0 && loopBlock.blockType === "if") {
              const nestedChildren = rebuildBlocksFromTree([c]);
              return nestedChildren[0];
            }
            return loopBlock;
          });
      }

      return block;
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!projected || !over) return;

    const activeItem = flattenedItems.find(({ id }) => id === active.id);
    const overItem = flattenedItems.find(({ id }) => id === over.id);

    if (!activeItem || !overItem) return;

    // prevent moving control flow blocks inappropriately
    if (activeItem.isControlFlowChild) {
      // prevent moving else/elseif blocks away from their if block
      if (
        activeItem.block.blockType === "else" ||
        activeItem.block.blockType === "else-if"
      ) {
        if (overItem.controlFlowParentId !== activeItem.controlFlowParentId) {
          return;
        }
      }
    }

    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      // determine the new parent block and role
      const newParentItem = parentId
        ? clonedItems.find(({ id }) => id === parentId)
        : null;
      let newBlockRole:
        | "thenBlock"
        | "elseIfBlock"
        | "elseBlock"
        | "loopBlock"
        | undefined = undefined;

      if (newParentItem) {
        if (newParentItem.block.blockType === "if") {
          newBlockRole = "thenBlock";
        } else if (newParentItem.block.blockType === "while") {
          newBlockRole = "loopBlock";
        }
      }

      // update the active item with new depth and parent info
      clonedItems[activeIndex] = {
        ...activeTreeItem,
        depth,
        parentId,
        blockRole: newBlockRole,
        isControlFlowChild: !!newBlockRole,
        controlFlowParentId: parentId ? parentId : undefined,
      };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);
      setItems(newItems);

      // rebuild the blocks structure
      const newBlocks = rebuildBlocksFromTree(newItems);
      setState({
        ...state,
        blocks: newBlocks,
      });
    }
  }
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};
