import React from "react";
import { useCodeGenerator } from "./context";
import { FunctionInfo } from "@repo/parser";
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

type SortableItemProps = {
  func: FunctionInfo;
  index: number;
  onRemove: (index: number) => void;
};

const SortableItem: React.FC<SortableItemProps> = ({
  func,
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
      className="p-4 mb-2 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-move"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">{func.name}</h3>
        <button
          className="text-red-500 hover:text-red-700 transition-colors duration-200 z-10"
          onClick={(event) => handleRemove(event, index)}
        >
          &times;
        </button>
      </div>
      {!!func.parameters && !!func.parameters.length && (
        <p className="text-sm text-gray-600">
          Parameters:{" "}
          <span className="font-semibold">
            {func.parameters
              .map((param) => `${param.name}:${param.type}`)
              .join(", ")}
          </span>
        </p>
      )}
    </div>
  );
};

export const SortableFunctionList: React.FC = () => {
  const { functions, setFunctions } = useCodeGenerator();

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
      setFunctions(arrayMove(functions, oldIndex, newIndex));
    }
  };

  const handleRemove = (index: number) => {
    setFunctions(functions.filter((_, i) => i !== index - 1));
  };

  const functionsWithId = functions.map((func, index) => ({
    ...func,
    id: index + 1,
  }));

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Function List</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={functionsWithId.map((func) => func.id)}
          strategy={verticalListSortingStrategy}
        >
          {functionsWithId.map((func) => (
            <SortableItem
              key={`${func.id}-${func.name}`}
              func={func}
              index={func.id}
              onRemove={handleRemove}
            />
          ))}
        </SortableContext>
      </DndContext>
      {functions.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          No functions added yet. Use the search dialog to add functions.
        </p>
      )}
    </div>
  );
};
