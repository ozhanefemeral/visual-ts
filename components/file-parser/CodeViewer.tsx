"use client";

import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeViewerProps {
  fileContent: string;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ fileContent }) => {
  return (
    <div className="max-h-96 overflow-y-auto">
      <SyntaxHighlighter
        language="typescript"
        style={vscDarkPlus}
        customStyle={{ margin: 0 }}
      >
        {fileContent}
      </SyntaxHighlighter>
    </div>
  );
};
