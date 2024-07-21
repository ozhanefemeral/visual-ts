import { ReactNode } from "react";

interface KeyCombinationLabelProps {
  children: ReactNode;
}

export const KeyCombinationLabel = ({ children }: KeyCombinationLabelProps) => {
  return (
    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
      {children}
    </kbd>
  );
};
