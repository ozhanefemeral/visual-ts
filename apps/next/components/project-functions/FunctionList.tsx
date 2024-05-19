"use client";

import { useState } from "react";
import { FunctionInfo } from "@repo/parser";
import { TypeSpan } from "../file-parser/ModuleTypes/TypeBadge";
import { Separator } from "@ui/separator";
import { FunctionInfoPopover } from "../shared/FunctionInfoPopover";
import { useDraggable } from "@dnd-kit/core";

interface FunctionListItemProps {
  func: FunctionInfo;
  showDescription: boolean;
}
const FunctionListItem: React.FC<FunctionListItemProps> = ({
  func,
  showDescription,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${func.name}`,
    data: { func },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      className="flex flex-col gap-y-2 bg-gray-100 rounded-md p-4 relative"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between">
        <h2 className="text-lg font-bold">
          {func.name}: <TypeSpan type={func.returnType} />
          <span className="absolute right-4 top-4">
            <FunctionInfoPopover func={func} />
          </span>
        </h2>
      </div>
      {showDescription && func.jsDocComment && (
        <p className="text-xs">{func.jsDocComment.toString()}</p>
      )}
    </div>
  );
};

export const FunctionList = ({ functions }: { functions: FunctionInfo[] }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [search, setSearch] = useState("");

  const filteredFunctions = functions.filter((func) =>
    func.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col gap-y-2 pb-4">
        <div>
          <input
            type="checkbox"
            checked={showDescription}
            onChange={() => setShowDescription(!showDescription)}
            className="mr-2"
          />
          <label>Show Description</label>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="border border-gray-300 rounded-md p-2 w-full"
        />
        <Separator />
      </div>

      <div className="flex flex-col gap-y-4">
        {filteredFunctions.map((func) => (
          <FunctionListItem
            key={func.name}
            func={func}
            showDescription={showDescription}
          />
        ))}
      </div>
    </div>
  );
};
