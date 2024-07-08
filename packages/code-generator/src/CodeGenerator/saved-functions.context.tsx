import React, { createContext, useContext, useState, useEffect } from "react";
import { FunctionInfo } from "@parser/module-parser/types";
import { VariableInfoWithIndex } from "./functions";

interface SavedFunctionState {
  name: string;
  functions: FunctionInfo[];
  variables: VariableInfoWithIndex[];
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
  saveCurrentState: (
    name: string,
    functions: FunctionInfo[],
    variables: VariableInfoWithIndex[]
  ) => void;
  loadSavedState: (state: SavedFunctionState) => void;
}

const SavedFunctionsContext = createContext<
  SavedFunctionsContextType | undefined
>(undefined);

export const SavedFunctionsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [savedFunctions, setSavedFunctions] = useState<SavedFunctionState[]>(
    []
  );
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  useEffect(() => {
    const savedFunctionsFromStorage = localStorage.getItem("savedFunctions");
    if (savedFunctionsFromStorage) {
      setSavedFunctions(JSON.parse(savedFunctionsFromStorage));
    }
  }, []);

  const saveCurrentState = (
    name: string,
    functions: FunctionInfo[],
    variables: VariableInfoWithIndex[]
  ) => {
    const newState: SavedFunctionState = { name, functions, variables };
    const updatedSavedFunctions = [...savedFunctions, newState];
    setSavedFunctions(updatedSavedFunctions);
    localStorage.setItem(
      "savedFunctions",
      JSON.stringify(updatedSavedFunctions)
    );
  };

  const loadSavedState = (state: SavedFunctionState) => {
    // This function will be implemented in the CodeGenerator component
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
        loadSavedState,
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
