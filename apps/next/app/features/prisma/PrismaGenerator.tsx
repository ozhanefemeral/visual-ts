"use client";
import { Textarea } from "@ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import {
  generateCrud,
  CrudOutput,
  parsePrismaSchema,
} from "@ozhanefe/ts-codegenerator";
import { useState } from "react";
import { Button } from "@ui/button";
import { ScrollArea } from "@ui/scroll-area";

export const PrismaGenerator: React.FC = () => {
  const [schemaInput, setSchemaInput] = useState("");
  const [crudOutputs, setCrudOutputs] = useState<CrudOutput>({});

  const handleGenerateClick = () => {
    const schemaParsed = parsePrismaSchema(schemaInput);
    setCrudOutputs(
      generateCrud(schemaParsed, {
        operations: ["create", "delete", "read", "update"],
      })
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Textarea
          onChange={(e) => setSchemaInput(e.target.value)}
          value={schemaInput}
          className="min-h-96"
        />
        <div className="flex justify-end">
          <Button disabled={!schemaInput} onClick={handleGenerateClick}>
            Generate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(crudOutputs).map(([filename, operations]) => (
          <Card key={filename} className="w-full h-auto">
            <CardHeader>
              <CardTitle className="text-sm font-mono">{filename}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-40">
                {Object.entries(operations).map(([operation, content]) => (
                  <div key={operation} className="mb-4">
                    <h2 className="text-xs font-semibold capitalize">
                      {operation}
                    </h2>
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {content}
                    </pre>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
