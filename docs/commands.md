# Development Commands

## Package Manager

This project uses **pnpm** as the package manager.

## Installation

```bash
pnpm install
```

## Development Server

```bash
pnpm start           # Choose platform interactively
pnpm android         # Start on Android emulator
pnpm ios             # Start on iOS simulator
pnpm web             # Start web version
```

## Code Quality

```bash
# Linting
pnpm lint

# TypeScript type checking
pnpm tsc --noEmit
```

## Database Migrations

```bash
npx drizzle-kit generate  # Generate migrations from schema
npx drizzle-kit migrate   # Apply migrations
npx drizzle-kit studio    # Open Drizzle Studio
```

## Note

This project does not currently have a test suite configured.
