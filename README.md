# VisualTS

A powerful React/Next.js visual code generator for TypeScript projects. Built on top of the ts-generator package.

![code-generator](https://github.com/ozhanefemeral/visual-ts/assets/22786810/68d5f1ea-84dd-4955-abf9-81b3e0e5b1d3)

## Key Features

- **Module Parsing**: Extract information about functions, variables, and types from TypeScript files.
- **Code Generation**: Generate new TypeScript code based on parsed information.
- **Function Call Generation**: Create TypeScript AST nodes for function calls, including async functions and Promises.
- **Variable Declaration Generation**: Generate variable declarations with associated function calls.
- **Unique Variable Naming**: Automatically generate unique variable names to avoid conflicts.
- **Type Extraction**: Extract and process return types from functions, including Promise types.
- **Drag-and-drop Code Generation**: Build custom functions by dragging and dropping functions from your codebase.
- **TypeScript and React Visualization**: Visualize the structure and dependencies of TypeScript modules and React components.

## Project Structure

- `packages/ts-generator`: Core TypeScript utility package
- `apps/next`: Next.js app showcasing ts-generator features
- `packages/ui`: Shared component library
- `packages/eslint-config`: ESLint configurations
- `packages/typescript-config`: Shared TypeScript configurations

## Installation

To use ts-generator in your project:

```bash
npm install @ozhanefe/ts-generator
# or
yarn add @ozhanefe/ts-generator
# or
pnpm add @ozhanefe/ts-generator
# or
bun add @ozhanefe/ts-generator
```

Note: This package requires TypeScript as a peer dependency.

## Usage

Here's a basic example of how to use the ts-generator package:

```typescript
import { parseFunctionsFromFile, generateCode } from "@ozhanefe/ts-generator";

// Parse functions from a TypeScript file
const { functionsInfo } = parseFunctionsFromFile("path/to/your/file.ts");

// Generate new code based on the parsed functions
const generatedCode = generateCode(functionsInfo);

console.log(generatedCode);
```

## Development

To set up the project for development:

1. Clone the repository: `git clone https://github.com/ozhanefemeral/ts-generator`
2. Install dependencies: `pnpm install`
3. Build all packages: `pnpm build`
4. Start the development server: `pnpm dev`
5. Open the Next.js app in your browser at `http://localhost:3000`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Roadmap

Check out our [roadmap](https://visual-ts.vercel.app/roadmap) to see what's coming next.
