# Code Style Guidelines

## Import Organization

Use path aliases: `@/` maps to project root

Group imports in this order:

1. React/React Native
2. Third-party libraries (Expo, external packages)
3. Internal modules using `@/` alias
4. Relative imports
5. Type imports (if not inline)

**Example:**

```typescript
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { databaseName } from '@/constants/database';
```

## Formatting (Prettier)

- **Single quotes** for strings
- **Semicolons** required
- **2 spaces** indentation (no tabs)
- **100 character** line width
- **ES5 trailing commas**
- Arrow function parens: always
- JSX: double quotes, bracket on new line

Run `npx prettier --write .` to format code.

## TypeScript Conventions

- **Strict mode enabled** - all strict type checking rules apply
- Use explicit types for function parameters and return values
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use `const` for variables that won't be reassigned
- Avoid `any` - use `unknown` if type is truly unknown

## Naming Conventions

- **Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Files:** camelCase for utilities, PascalCase for components
- **Variables/Functions:** camelCase
- **Constants:** camelCase (not SCREAMING_SNAKE_CASE)
- **Types/Interfaces:** PascalCase
- **Database tables:** snake_case

## Component Structure

- Use functional components with arrow functions
- Export default at the bottom of file
- Define component before export

**Example:**

```typescript
const Index = () => {
  return (
    <View style={{ flex: 1 }}>
      <Text>Content</Text>
    </View>
  );
};

export default Index;
```

## Error Handling

- Use try-catch for async operations
- Handle errors gracefully with user-friendly messages
- Log errors appropriately for debugging
- Consider using error boundaries for React components

## Comments

- Use `//` for single-line comments
- Use `TODO:` prefix for tasks (e.g., `// TODO: implement feature`)
- Comment complex logic and business rules
