import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { useSavedFunctions } from "./saved-functions.context";
import { FunctionInfo } from "@repo/parser";
import { VariableInfoWithIndex } from "./functions";

interface SaveDialogProps {
  onSave: (name: string) => void;
  isEmpty: boolean;
}

export const SaveDialog: React.FC<SaveDialogProps> = ({ onSave, isEmpty }) => {
  const { saveDialogOpen, setSaveDialogOpen, saveName, setSaveName } =
    useSavedFunctions();

  const handleSave = () => {
    if (saveName.trim() === "") return;
    onSave(saveName);
    setSaveDialogOpen(false);
    setSaveName("");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (saveDialogOpen && event.key === "Enter") {
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveDialogOpen, saveName]);

  return (
    <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={isEmpty}>Save</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Function</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Enter function name"
          value={saveName}
          onChange={(e) => setSaveName(e.target.value)}
          className="mt-4"
        />
        <Button onClick={handleSave} className="mt-4">
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
};

interface LoadDialogProps {
  onLoad: (state: {
    name: string;
    functions: FunctionInfo[];
    variables: VariableInfoWithIndex[];
  }) => void;
}

export const LoadDialog: React.FC<LoadDialogProps> = ({ onLoad }) => {
  const {
    savedFunctions,
    loadDialogOpen,
    setLoadDialogOpen,
    deleteSavedState,
  } = useSavedFunctions();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [functionToDelete, setFunctionToDelete] = useState<string | null>(null);

  const handleDelete = (name: string) => {
    setFunctionToDelete(name);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (functionToDelete) {
      deleteSavedState(functionToDelete);
      setDeleteConfirmOpen(false);
      setFunctionToDelete(null);

      if (savedFunctions.length === 1) {
        setLoadDialogOpen(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === "o" &&
        savedFunctions.length > 0
      ) {
        event.preventDefault();
        setLoadDialogOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button disabled={savedFunctions.length === 0}>
            Load Saved Functions (⌘O)
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Saved Functions</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {savedFunctions.map((savedFunc, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{savedFunc.name}</span>
                <div>
                  <Button onClick={() => onLoad(savedFunc)} className="mr-2">
                    Load
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(savedFunc.name)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this saved function? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
