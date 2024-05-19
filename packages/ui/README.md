# UI Package

## Purpose

The `/ui` package is designed to centralize all UI elements for code reusability and ease of maintenance.

## Adding New Components

To add new components to the `/ui` package, follow these steps:

1. **Navigate to the Root of the `/ui` Package:**
   Ensure you are in the root directory of the `/ui` package before running any commands.

   ```sh
   cd /packages/ui
   ```

2. **Run the Command to Add the Component:**
   Use the `ui:add` command from `package.json` to add new components. For example, to add a carousel component, you would run:

   ```sh
   bun ui:add carousel
   ```

   Alternatively, you can also use the `bunx` command from the [shadcn/ui documentation](https://shadcn.dev/docs/components) for each component. Make sure you select 'Bun' from the dropdown menu:

   ```sh
   bunx --bun shadcn-ui@latest add carousel
   ```

Former method is easier, just change the `carousel` to the name of the component you want to add.

3. **Move the Component to the `src` Directory:**
   After adding the component, it might be located in a different directory. Move the component to the `src` directory to keep all components organized in one place.

   ```sh
   mv path/to/added/component src/
   ```
