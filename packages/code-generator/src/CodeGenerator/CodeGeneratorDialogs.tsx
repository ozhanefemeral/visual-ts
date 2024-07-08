import React from "react";
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
  const { savedFunctions, loadDialogOpen, setLoadDialogOpen } =
    useSavedFunctions();

  return (
    <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
      <DialogTrigger asChild>
        <Button>Load Saved Functions</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Saved Functions</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {savedFunctions.map((savedFunc, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>{savedFunc.name}</span>
              <Button onClick={() => onLoad(savedFunc)}>Load</Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
