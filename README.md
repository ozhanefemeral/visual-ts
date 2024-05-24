# VisualTS

Develop TypeScript / React apps with drag & drop!

![code-generator](https://github.com/ozhanefemeral/visual-ts/assets/22786810/68d5f1ea-84dd-4955-abf9-81b3e0e5b1d3)

## Overview

The VisualTS tool allows you to visualize the structure and contents of TypeScript files and React components. It aims to provide a user-friendly interface for developers to explore and understand the codebase they're working with.


## Key Features

- **Drag-and-drop Code Generation**: By simply dragging and dropping funcitons declared in your codebase; you can build custom functions.
- **Parsing TypeScript Files**: The tool can parse TypeScript files and extract information about the functions, variables and relationships.
- **Visualizing TypeScript Modules**: The parsed information is presented in a visual format, making it easier to understand the structure and dependencies of TypeScript modules.
- **Visualizing React Components**: The tool can also parse and visualize React components, showing the component hierarchy and the props/state relationships.

## Apps and Packages

Right now, code-generation functions and components are inside the Next.js app. Also, React components used for parsing are in the `/next`.
WIP for moving those to packages.

- `next`: [Next.js](https://nextjs.org/) app
- `@repo/ui`: component library to use within the monorepo
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@repo/parser`: functions and types used for parsing throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/) (and plan to stay that way).

## Build

To build all apps and packages, run the following command (in the root of the monorepo):

```
bun build
```

## Getting Started

1. Clone the repository: `git clone https://github.com/ozhanefemeral/visual-ts`
2. Install dependencies: `bun install`

3. Start the development server: `bun dev`
4. Open the application in your browser at `http://localhost:3000`

   p.s. You can use npm, yarn and pnpm too

## Usage

1. Create a file, with `.ts` or `.tsx` extension. It supports only these file types _for now_.
2. In `app/page.tsx` render it using `<FileParser />` component. There is an example left out in app/page.tsx.

## Roadmap

<!-- Text -Check it out- with navigating to https://visual-ts.vercel.app/roadmap -->

[Check it out](https://visual-ts.vercel.app/roadmap)

## Contributing

Any contribution is welcomed! Feel free to contact me or open an issue.
