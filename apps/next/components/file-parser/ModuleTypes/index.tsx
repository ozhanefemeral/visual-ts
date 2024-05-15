"use client";
import { assignColorsToElements } from "@/lib/utils";
import { TypeBadge } from "./TypeBadge";

interface ModuleTypesProps {
  types: string[];
}

export const ModuleTypes: React.FC<ModuleTypesProps> = ({ types }) => {
  const colors = assignColorsToElements(types);

  return (
    <div className="w-full md:w-1/3 mt-8">
      <h2 className="text-lg font-semibold mb-4">Types</h2>
      <div className="flex flex-wrap gap-4">
        {types.map((type, index) => (
          <TypeBadge key={`type-${index}`} type={type} color={colors[index]} />
        ))}
      </div>
    </div>
  );
};
