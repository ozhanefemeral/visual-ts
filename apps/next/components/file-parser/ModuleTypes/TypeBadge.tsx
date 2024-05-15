"use client";

import { generateRandomColorFromStr } from "@/lib/utils";

interface TypeBadgeProps {
  type: string;
  color: string;
}

export const TypeBadge: React.FC<TypeBadgeProps> = ({ type, color }) => {
  return (
    <div
      className={`flex rounded-md p-2 items-center bg-gray-100 gap-x-2`}
      style={{
        color: color,
      }}
    >
      <div
        className={`mt-2 w-2 h-2 rounded-full mb-2`}
        style={{ backgroundColor: color }}
      ></div>
      <p className="text-sm font-semibold">{type}</p>
    </div>
  );
};

export const TypeSpan: React.FC<{ type: string }> = ({ type }) => {
  const color = generateRandomColorFromStr(type);

  return (
    <span
      className={`gap-x-2 text-sm font-semibold`}
      style={{
        color: color,
      }}
    >
      {type}
    </span>
  );
};
