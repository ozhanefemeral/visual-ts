# @ozhanefe/ts-codegenerator

`@ozhanefe/ts-codegenerator` is a TypeScript utility package that provides powerful tools for parsing TypeScript code and generating new code based on the parsed information. It's designed to help developers analyze existing TypeScript projects and automate code generation tasks.

## Features

- **Module Parsing**: Extract information about functions, variables and types
- **Code Generation**: Generate new TypeScript code based on parsed information.
- **Block-based Code Generation**: New 'Blocks' concept for more flexible code generation.
- **Function Call Generation**: Create TypeScript AST nodes for function calls, including handling of async functions and Promises.
- **Variable Declaration Generation**: Generate variable declarations with associated function calls.
- **Unique Variable Naming**: Automatically generate unique variable names to avoid conflicts when generating code.
- **Type Extraction**: Extract and process return types from functions, including handling of Promise types.

## Installation

Install the package using bun:

```bash
bun add @ozhanefe/ts-codegenerator
```

Note: This package requires TypeScript as a peer dependency. Make sure you have TypeScript installed in your project.

## Usage

Here's a basic example of how to use the package:

```typescript
import {
  parseFunctionsFromFile,
  generateCode,
} from "@ozhanefe/ts-codegenerator";

// Parse functions from a TypeScript file
const { functionsInfo } = parseFunctionsFromFile("path/to/your/file.ts");

// Generate new code based on the parsed functions
const generatedCode = generateCode(functionsInfo);

console.log(generatedCode);
```

## Running Tests

To run the unit tests, including the new tests for the function call block generator:

```bash
bun test
```

## Contributing

Contributions are welcome! Please create an issue or pull request if you have any suggestions or feedback.

p.s: We manually set the version of '@ozhanefe/ts-codegenerator' package in the apps isntead of linking from the local package. So what we work on does not affect the apps.
```