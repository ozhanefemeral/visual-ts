/* eslint-disable no-unused-vars */
"use client";
import React from "react";
import { useCodeGenerator } from "@contexts/CodeGeneratorContext";
import { CodeBlock } from "@ozhanefe/ts-codegenerator";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BlockViewRenderer } from "@/components/blocks";
import { Cross1Icon } from "@radix-ui/react-icons";

type SortableItemProps = {
  block: CodeBlock;
  index: number;
  onRemove: (index: number) => void;
};

const SortableItem: React.FC<SortableItemProps> = ({
  block,
  index,
  onRemove,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemove = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    event.preventDefault();
    onRemove(index);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mb-2 cursor-move relative group"
    >
      <BlockViewRenderer block={block} />
      <button
        className="absolute top-2 right-8 text-red-500 hover:text-red-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
        onClick={(event) => handleRemove(event, index)}
      >
        <Cross1Icon className="h-5 w-5" />
      </button>
    </div>
  );
};

export const SortableBlockList: React.FC = () => {
  const { state, setState } = useCodeGenerator();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = Number(active.id) - 1;
      const newIndex = Number(over.id) - 1;
      setState({
        ...state,
        blocks: arrayMove(state.blocks, oldIndex, newIndex),
      });
    }
  };

  const handleRemove = (index: number) => {
    setState({
      ...state,
      blocks: state.blocks.filter((_, i) => i !== index - 1),
    });
  };

  const blocksWithId = state.blocks.map((block, index) => ({
    ...block,
    id: index + 1,
  }));

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Block List</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocksWithId}
          strategy={verticalListSortingStrategy}
        >
          {blocksWithId.map((block) => (
            <SortableItem
              key={`block-${block.id}`}
              block={block}
              index={block.id}
              onRemove={handleRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
      {state.blocks.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No blocks added yet. Use the search dialog to add blocks.
        </p>
      )}
    </div>
  );
};
