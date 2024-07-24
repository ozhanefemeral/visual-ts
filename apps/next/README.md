# VisualTS

Develop TypeScript / React apps with drag & drop!

![code-generator](https://github.com/ozhanefemeral/visual-ts/assets/22786810/2939341e-8a37-428a-80aa-a76c35c3a1b5)

## Overview

The VisualTS tool allows you to visualize the structure and contents of TypeScript files and React components. It aims to provide a user-friendly interface for developers to explore and understand the codebase they're working with.

![image](https://github.com/ozhanefemeral/visual-ts/assets/22786810/d288b080-ce05-405e-b9c1-2d112dc5ba04)

## Key Features

- **Drag-and-drop Code Generation**: By simply dragging and dropping funcitons declared in your codebase; you can build custom functions.
- **Parsing TypeScript Files**: The tool can parse TypeScript files and extract information about the functions, variables and relationships.
- **Visualizing TypeScript Modules**: The parsed information is presented in a visual format, making it easier to understand the structure and dependencies of TypeScript modules.
- **Visualizing React Components**: The tool can also parse and visualize React components, showing the component hierarchy and the props/state relationships.

## Getting Started

1. Clone the repository: `git clone https://github.com/ozhanefemeral/visual-ts`
2. Install dependencies: `bun install`

3. Start the development server: `bun dev`
4. Open the application in your browser at `http://localhost:3000`

   p.s. You can use npm, yarn and bun too

## Usage

1. Create a file, with `.ts` or `.tsx` extension. It supports only these file types _for now_.
2. In `app/page.tsx` render it using `<FileParser />` component. There is an example left out in app/page.tsx.

## Roadmap

1. Make utility functions such as colorizing and parsing functions a package; independent from this repo.
2. Fixing colorization. Right now `Promise<User[]>`, `User[]`, and `User` returns different colors. They could be shades of eachother.
3. Add drag & drop functionality to create new modules or edit existing ones.

## Contributing

Any contribution is welcomed! Feel free to contact me or open an issue.
