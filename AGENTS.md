# DroneFrequency - Agent Guidelines

DroneFrequency is a React Native app built with Expo Router, using SQLite for local storage via Drizzle ORM and TanStack Query for state management.

**Package manager:** pnpm

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

## Special Configuration

- **New Architecture:** Expo's new architecture is enabled (`newArchEnabled: true`)
- **React Compiler:** Experimental React compiler is enabled
- **Typed Routes:** Expo Router typed routes are enabled
- **Migrations:** Currently commented out in `app/_layout.tsx` - uncomment when ready
- **Edge-to-edge:** Android edge-to-edge is enabled

## Detailed Guidelines

For specific conventions and best practices, see:

- [Development Commands](docs/commands.md) - All pnpm commands, linting, type checking, migrations
- [Code Style Guidelines](docs/code-style.md) - TypeScript, formatting, naming conventions, component structure
- [Testing Guidelines](docs/testing.md) - Test structure, queries, mocking patterns, best practices
- [Database Guidelines](docs/database.md) - Schema management, migrations, Drizzle patterns
- [State Management](docs/state-management.md) - TanStack Query, React hooks, Context API
- [React Native Best Practices](docs/react-native.md) - Expo APIs, performance, platform-specific patterns
- [Git Workflow](docs/git-workflow.md) - Commit conventions and pre-commit checklist

## Pre-Commit Checklist

1. Update types when changing data structures
2. Generate and test migrations for schema changes
3. Run `pnpm lint` and `pnpm tsc --noEmit`
4. Test on target platform(s)
