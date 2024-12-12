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
import type { FlattenedItem, SensorContext, TreeItems } from "./types";
import {
  buildTree,
  flattenTree,
  getChildCount,
  getProjection,
  removeChildrenOf,
  removeItem,
  setProperty,
} from "./utilities";

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

  const [items, setItems] = useState<TreeItems>(() =>
    state.blocks.map((block, index) => ({
      id: block.index.toString(),
      children: [],
      block,
    }))
  );

  useEffect(() => {
    setItems(
      state.blocks.map((block) => ({
        id: block.index.toString(),
        children: [],
        block,
      }))
    );
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
    console.log(flattenedTree);

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
    onDragEnd({ active, over }) {
      const announcement = getMovementAnnouncement(
        "onDragEnd",
        active.id,
        over?.id
      );
      // @ts-ignore - DragEndEvent type mismatch but functionality works
      handleDragEnd({ active, over });
      return announcement;
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

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

  function handleDragEnd({ active, over }: DragEndEvent) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(
        JSON.stringify(flattenTree(items))
      );
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      setItems(newItems);

      const newBlocks = sortedItems
        .map((item) => item.block)
        .filter((block): block is NonNullable<typeof block> => block !== null);

      setState({
        ...state,
        blocks: newBlocks,
      });
    }
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
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};
