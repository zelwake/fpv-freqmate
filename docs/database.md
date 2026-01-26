# Database Guidelines

## Schema Management

- Schema defined in `db/schema.ts` using Drizzle ORM
- Migrations stored in `drizzle/` directory
- Database name: `frequencies.db` (from `constants/database.ts`)

## Migration Workflow

1. Make changes to `db/schema.ts`
2. Generate migration: `npx drizzle-kit generate`
3. Apply migration: `npx drizzle-kit migrate`
4. **Always generate migrations after schema changes**

## Query Patterns

- Use Drizzle's type-safe query builder
- Avoid raw SQL queries when possible

## Development Tools

- **Drizzle Studio:** `npx drizzle-kit studio` - Visual database browser
