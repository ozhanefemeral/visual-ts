/* eslint-disable no-unused-vars */
import React, { createContext, useContext, useState, useEffect } from "react";
import { CodeGeneratorState } from "@ozhanefe/ts-codegenerator";
import { generateRealisticDevDayState } from "@/lib/utils";

interface SavedFunctionState {
  name: string;
  state: CodeGeneratorState;
}

interface SavedFunctionsContextType {
  savedFunctions: SavedFunctionState[];
  setSavedFunctions: React.Dispatch<React.SetStateAction<SavedFunctionState[]>>;
  saveDialogOpen: boolean;
  setSaveDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loadDialogOpen: boolean;
  setLoadDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saveName: string;
  setSaveName: React.Dispatch<React.SetStateAction<string>>;
  saveCurrentState: (name: string, state: CodeGeneratorState) => void;
  deleteSavedState: (name: string) => void;
}

const SavedFunctionsContext = createContext<
  SavedFunctionsContextType | undefined
>(undefined);

const initialState = [
  { name: "Demo - Dev Day", state: generateRealisticDevDayState() },
];

export const SavedFunctionsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [savedFunctions, setSavedFunctions] =
    useState<SavedFunctionState[]>(initialState);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    const savedFunctionsFromStorage = localStorage.getItem("savedFunctions");
    if (savedFunctionsFromStorage && savedFunctionsFromStorage !== "[]") {
      setSavedFunctions(JSON.parse(savedFunctionsFromStorage));
      return;
    }

    setSavedFunctions(initialState);
  }, []);

  const saveCurrentState = (name: string, state: CodeGeneratorState) => {
    const newState: SavedFunctionState = { name, state };
    const updatedSavedFunctions = [...savedFunctions, newState];
    setSavedFunctions(updatedSavedFunctions);
    localStorage.setItem(
      "savedFunctions",
      JSON.stringify(updatedSavedFunctions)
    );
  };

  const deleteSavedState = (name: string) => {
    const index = savedFunctions.findIndex((func) => func.name === name);
    if (index < 1) return;
    const updatedSavedFunctions = savedFunctions.filter(
      (func) => func.name !== name
    );
    setSavedFunctions(updatedSavedFunctions);
    localStorage.setItem(
      "savedFunctions",
      JSON.stringify(updatedSavedFunctions)
    );
  };

  return (
    <SavedFunctionsContext.Provider
      value={{
        savedFunctions,
        setSavedFunctions,
        saveDialogOpen,
        setSaveDialogOpen,
        loadDialogOpen,
        setLoadDialogOpen,
        saveName,
        setSaveName,
        saveCurrentState,
        deleteSavedState,
      }}
    >
      {children}
    </SavedFunctionsContext.Provider>
  );
};

export const useSavedFunctions = () => {
  const context = useContext(SavedFunctionsContext);
  if (context === undefined) {
    throw new Error(
      "useSavedFunctions must be used within a SavedFunctionsProvider"
    );
  }
  return context;
};
