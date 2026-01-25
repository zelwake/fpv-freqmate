# DroneFrequency - Agent Guidelines

This document provides essential information for AI coding agents working in this repository.

## Project Overview

DroneFrequency is a React Native app built with Expo Router, using SQLite for local storage via Drizzle ORM and TanStack Query for state management.

**Tech Stack:**

- React Native 0.81.5 + React 19.1.0
- Expo SDK ~54 with Router ~6
- TypeScript 5.9.2 (strict mode enabled)
- Drizzle ORM + expo-sqlite
- TanStack Query v5
- pnpm as package manager

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start           # Choose platform interactively
pnpm android         # Start on Android emulator
pnpm ios             # Start on iOS simulator
pnpm web             # Start web version

# Linting
pnpm lint            # Run ESLint with Expo config

# TypeScript type checking
pnpm tsc --noEmit    # Check TypeScript types without emitting files

# Database migrations
npx drizzle-kit generate  # Generate migrations from schema
npx drizzle-kit migrate   # Apply migrations
npx drizzle-kit studio    # Open Drizzle Studio
```

**Note:** This project does not currently have a test suite configured. Tests should be added using Jest or Vitest when needed.

## Project Structure

```
app/              - File-based routing (Expo Router)
components/       - Reusable React components
hooks/            - Custom React hooks
constants/        - Constants and configuration
db/               - Database schema and queries
  schema.ts       - Drizzle ORM schema definitions
drizzle/          - Generated migrations
assets/           - Static assets (images, fonts)
scripts/          - Build and utility scripts
```

## Code Style Guidelines

### Imports

- Use path aliases: `@/` maps to project root
- Group imports in this order:
  1. React/React Native
  2. Third-party libraries (Expo, external packages)
  3. Internal modules using `@/` alias
  4. Relative imports
  5. Type imports (if not inline)

**Example:**

```typescript
import { databaseName } from '@/constants/database';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { SQLiteProvider } from 'expo-sqlite';
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';
```

### Formatting (Prettier)

- **Single quotes** for strings
- **Semicolons** required
- **2 spaces** indentation (no tabs)
- **100 character** line width
- **ES5 trailing commas**
- Arrow function parens: always
- JSX: double quotes, bracket on new line

Run `npx prettier --write .` to format code.

### TypeScript

- **Strict mode enabled** - all strict type checking rules apply
- Use explicit types for function parameters and return values
- Prefer `interface` for object shapes, `type` for unions/intersections
- Use `const` for variables that won't be reassigned
- Avoid `any` - use `unknown` if type is truly unknown

### Naming Conventions

- **Components:** PascalCase (e.g., `UserProfile.tsx`)
- **Files:** camelCase for utilities, PascalCase for components
- **Variables/Functions:** camelCase
- **Constants:** camelCase (not SCREAMING_SNAKE_CASE)
- **Types/Interfaces:** PascalCase
- **Database tables:** snake_case

### Component Structure

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

### Error Handling

- Use try-catch for async operations
- Handle errors gracefully with user-friendly messages
- Log errors appropriately for debugging
- Consider using error boundaries for React components

### Comments

- Use `//` for single-line comments
- Use `TODO:` prefix for tasks (e.g., `// TODO: implement feature`)
- Comment complex logic and business rules
- Avoid obvious comments

## Database Guidelines

- Schema defined in `db/schema.ts` using Drizzle ORM
- Migrations stored in `drizzle/` directory
- Database name: `frequencies.db` (from `constants/database.ts`)
- Always generate migrations after schema changes
- Use Drizzle's type-safe query builder

## State Management

- Use TanStack Query for server state and async data
- Follow TanStack Query best practices (enabled in ESLint)
- Use React hooks (useState, useEffect, etc.) for local component state
- Consider React Context for app-wide state if needed

## React Native Best Practices

- Use Expo APIs when available (expo-sqlite, expo-constants, etc.)
- Leverage Expo Router for navigation (file-based routing in `app/`)
- Use `expo-image` instead of React Native's Image component
- Test on multiple platforms (iOS, Android, Web)
- Use SafeAreaView or react-native-safe-area-context

## Performance

- Use React.memo for expensive components
- Implement proper list virtualization (FlatList, not ScrollView)
- Optimize images and assets
- Be mindful of bundle size
- Use Suspense for code splitting when appropriate

## Git Workflow

- Write clear, concise commit messages
- Keep commits focused on single changes
- Use conventional commit format when possible
- Test before committing

## Special Notes

- **New Architecture:** Expo's new architecture is enabled (`newArchEnabled: true`)
- **React Compiler:** Experimental React compiler is enabled
- **Typed Routes:** Expo Router typed routes are enabled
- **Migrations:** Currently commented out in `app/_layout.tsx` - uncomment when ready
- **Edge-to-edge:** Android edge-to-edge is enabled

## When Making Changes

1. Read relevant code before making changes
2. Follow existing patterns and conventions
3. Update types when changing data structures
4. Generate and test migrations for schema changes
5. Ensure code passes linting: `pnpm lint`
6. Ensure code passes type checking: `pnpm tsc --noEmit`
7. Test on target platform(s)
8. Keep changes minimal and focused

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TanStack Query](https://tanstack.com/query/latest)
- [React Native](https://reactnative.dev/)
