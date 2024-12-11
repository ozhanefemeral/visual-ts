"use client";
import { Textarea } from "@ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { useToast } from "@ui/hooks/use-toast";
import {
  generateCrud,
  CrudOutput,
  parsePrismaSchema,
} from "@ozhanefe/ts-codegenerator";
import { useState } from "react";
import { Button } from "@ui/button";
import { ScrollArea } from "@ui/scroll-area";
import { Copy, Settings, SquareCheckBig } from "lucide-react";
import { Checkbox } from "@ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Label } from "@ui/label";

const OPERATIONS = ["create", "delete", "read", "update"] as const;
type Operation = (typeof OPERATIONS)[number];

export const PrismaGenerator: React.FC = () => {
  const [schemaInput, setSchemaInput] = useState("");
  const [crudOutputs, setCrudOutputs] = useState<CrudOutput>({});
  const [usePrismaNamespace, setUsePrismaNamespace] = useState(true);
  const [selectedOperations, setSelectedOperations] = useState<Operation[]>([
    ...OPERATIONS,
  ]);
  const { toast } = useToast();

  const handleGenerateClick = () => {
    const schemaParsed = parsePrismaSchema(schemaInput);
    setCrudOutputs(
      generateCrud(schemaParsed, {
        usePrismaNamespace,
        ...(selectedOperations.length < OPERATIONS.length && {
          operations: selectedOperations,
        }),
      })
    );
  };

  const handleCopyCard = (operations: Record<string, string>) => {
    const mergedContent = Object.entries(operations)
      .map(([op, content]) => `// ${op}\n${content}`)
      .join("\n\n");
    navigator.clipboard.writeText(mergedContent);

    toast({
      description: "Copied to clipboard successfully",
    });
  };

  const handleSelectAllOperations = () => {
    setSelectedOperations([...OPERATIONS]);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="namespace"
              checked={usePrismaNamespace}
              onCheckedChange={(checked) =>
                setUsePrismaNamespace(checked as boolean)
              }
            />
            <Label htmlFor="namespace">use Prisma namespace</Label>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm py-2">operations</h4>
                  {selectedOperations.length < OPERATIONS.length && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSelectAllOperations}
                    >
                      <SquareCheckBig className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {OPERATIONS.map((op) => (
                  <div key={op} className="flex items-center space-x-2">
                    <Checkbox
                      id={op}
                      checked={selectedOperations.includes(op)}
                      onCheckedChange={(checked) => {
                        setSelectedOperations(
                          checked
                            ? [...selectedOperations, op]
                            : selectedOperations.filter((o) => o !== op)
                        );
                      }}
                    />
                    <Label htmlFor={op}>{op}</Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Textarea
          onChange={(e) => setSchemaInput(e.target.value)}
          value={schemaInput}
          className="min-h-96"
        />
        <div className="flex justify-end">
          <Button
            disabled={!schemaInput || selectedOperations.length === 0}
            onClick={handleGenerateClick}
          >
            Generate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(crudOutputs).map(([filename, operations]) => (
          <Card key={filename} className="w-full h-auto group relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleCopyCard(operations)}
            >
              <Copy className="h-4 w-4" />
            </Button>
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
