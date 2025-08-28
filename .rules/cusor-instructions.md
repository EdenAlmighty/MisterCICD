# Cursor Instructions

## Code Style

- Use TypeScript for all new code
- Use Vue 3 Composition API
- Use Pinia for state management
- Use Vue Router for routing
- Use SCSS for styling
- Use Vitest for unit testing
- Use Playwright for E2E testing

## Project Structure

- Components go in `src/components/`
- Pages go in `src/pages/`
- Services go in `src/services/`
- Stores go in `src/stores/`
- Types go in `src/types/`
- Styles go in `src/styles/`

## Testing

- Write unit tests for all components
- Write E2E tests for user workflows
- Use descriptive test names
- Test both success and error cases

## Terminal Configuration

### Terminal Setup

- Use Git Bash as the default terminal shell in Cursor
- Avoid PowerShell in Cursor due to terminal hanging issues
- Configure terminal.integrated.defaultProfile.windows to "Git Bash"

### Test Commands

When running tests in Cursor, use these flags to prevent terminal hanging:

#### Vitest (Unit Tests)

- **Use**: `npm run test:unit -- --run` (runs once and exits)
- **Avoid**: `npm run test:unit` (runs in watch mode and hangs)

#### Playwright (E2E Tests)

- **Use**: `npx playwright test --reporter=list` (runs once and exits)
- **Use**: `npx playwright test --reporter=dot` (minimal output)
- **Avoid**: `npm run test:e2e` (serves HTML report and hangs)

#### Other Commands

- Always use flags that make commands exit after completion
- Avoid commands that start servers or watch modes without explicit exit conditions
- If a command hangs, try adding `--run`, `--no-watch`, or `--reporter=list` flags

### Terminal Hanging Prevention

- Commands should complete and return to prompt immediately
- If a command hangs, check if it's running in watch mode or serving a report
- Use Ctrl+C to stop hanging commands
- Restart Cursor if terminal issues persist
- The hanging is often caused by test runners not exiting properly

### Git Bash Commands

- Use Unix-style commands: `ls`, `cd`, `pwd`, `cat`, `grep`
- Use `npm` and `git` commands normally
- Tab completion and command history work normally
- Most reliable option for Cursor integration

## Rules for Frontend Components

1. Each UI component must:
   - Use scoped SCSS modules (`ComponentName.module.scss`)
   - Be responsive using sass breakpoints
   - Be connected to the Pinia store only if needed
   - Be tested with Vitest and Playwright
   - All functions should be reusable have a single purpose
   - Helper functions will be placed in util.service.ts
   - Recycleable logic functions should be shared

2. Variables, spacing, and typography are defined by Figma tokens.
   - Tokens will be mapped in `/styles/variables.scss`

3. Use **props** for dynamic behavior, **emit** events for communication.
4. No logic duplication — extract composables if used in 2+ components.

## Backend Rules

1. Use the **Service Pattern** — controllers should only delegate logic.
2. Validation happens with DataAnnotations and FluentValidation (optional).
3. API endpoints follow RESTful structure:
   - `GET /api/items`
   - `POST /api/items`
   - `PUT /api/items/{id}`
   - `DELETE /api/items/{id}`

4. Use **async/await** and proper error handling in all services.

# Project Guidelines

This project is a **Vue 3 + TypeScript + Pinia + SCSS** application.
We are building a basic app to test CI/CD functionality.  
Use **local storage** for persistence (no backend).

---

## Folder Conventions

- `src/components/ComponentName/`
  - `ComponentName.vue`
  - `ComponentName.scss`
  - `ComponentName.test.ts`

- `src/pages/PageName/`
  - `PageName.vue`
  - `PageName.scss`
  - `PageName.test.ts`

- `src/services/`
  - `todo.service.ts` → CRUD for todos
  - `asyncStorage.service.ts` → wrapper around localStorage with async interface
  - `util.service.ts` → helper utilities

- `src/store/`
  - Pinia stores (example: `todo.store.ts`)

- `src/styles/`
  - Global styles like `main.scss`

---

## Rules

1. **Each component/page** must have its own folder containing:
   - Vue file
   - SCSS file
   - Test file

2. **SCSS Imports**
   - Each Vue file should `import './ComponentName.scss'`.

3. **Services**
   - Business logic lives inside `services/`
   - Example: `todo.service.ts` manages todo operations with localStorage

4. **State Management**
   - Use **Pinia** stores under `src/store/`

5. **Persistence**
   - Use `asyncStorage.service.ts` instead of direct `localStorage`

6. **Testing**
   - Each component/page has a `*.test.ts` file colocated in its folder
   - Never change the test logic without permission

---

## Example Component (TodoItem)

**`TodoItem.vue`**

```vue
<template>
  <li class="todo-item">{{ text }}</li>
</template>

<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<style scoped src="./TodoItem.scss"></style>

--- ## Responsibilities - Cursor should: - Generate Vue components with SCSS + props - Add unit
tests - Generate Pinia stores as needed - Validate backend endpoints against OpenAPI spec (if
present) - Run tests after each component is created - Do not build
```
