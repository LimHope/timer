# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16+ project bootstrapped with [EasyNext](https://github.com/easynextjs/easynext), a framework that provides pre-configured tooling and conventions optimized for rapid development with AI coding assistants.

## Development Commands

```bash
# Development server (uses Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

Access development server at http://localhost:3000

## Architecture & Key Patterns

### Feature-Sliced Design (FSD)

This project follows **Feature-Sliced Design** methodology - organizing code by user features rather than technical categories.

#### Core Principle

Structure code by **user features** rather than technical categories (components, hooks, utils).

#### Layer Hierarchy (Top → Bottom)

```
app/        # Entry point, global settings, providers, routing
pages/      # Complete page units (1:1 mapping with URL paths)
widgets/    # Independent and composable UI blocks (header, sidebar, dashboard)
features/   # User interaction features (create-account, delete-comment, filter-list)
entities/   # Business domain data structures (user, product, order)
shared/     # Reusable common code (api, config, lib, ui)
```

#### Strict Layer Rules

**1. Layer Import Rules**
- Higher layers can only import from lower layers
- Same-level layer imports are forbidden
- Reverse-direction imports are strictly prohibited

```
✅ features/ → entities/ → shared/
✅ pages/ → widgets/ → features/
❌ entities/ → features/
❌ features/A → features/B
```

**2. Slice Structure**

Each slice is organized by business domain:

```
features/
  create-account/
    model/      # State and business logic
    ui/         # Components
    api/        # API calls
    lib/        # Utilities
    index.ts    # Public API (exports only)
```

**3. Public API Rules**
- Each slice exports only through `index.ts`
- Star exports (`export *`) are forbidden
- Only use explicit named exports

```typescript
// ✅ Correct
export { CreateAccountForm } from './ui/CreateAccountForm';
export { useCreateAccount } from './model/useCreateAccount';

// ❌ Forbidden
export * from './ui';
```

### Directory Structure

```
src/
├── app/                              # Next.js App Router (FSD: app layer)
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   └── providers.tsx                 # Client-side providers (React Query, Theme)
│
├── pages/                            # FSD: pages layer (page compositions)
│   └── [route]/                      # URL-specific page assemblies
│
├── widgets/                          # FSD: widgets layer (independent UI blocks)
│   ├── header/                       # Header widget
│   ├── sidebar/                      # Sidebar widget
│   └── [widget-name]/
│       ├── ui/
│       └── index.ts
│
├── features/                         # FSD: features layer (user interactions)
│   └── [feature-name]/               # verb-noun naming (e.g., create-account)
│       ├── model/                    # State and business logic
│       ├── ui/                       # UI components
│       ├── api/                      # API functions
│       ├── lib/                      # Utilities
│       └── index.ts                  # Public API exports
│
├── entities/                         # FSD: entities layer (business domains)
│   └── [entity-name]/                # e.g., user, product, order
│       ├── model/                    # Domain types and state
│       ├── ui/                       # Entity-specific components
│       ├── api/                      # Entity CRUD operations
│       └── index.ts
│
└── shared/                           # FSD: shared layer (common code)
    ├── api/                          # HTTP client, base API config
    ├── config/                       # App configuration
    ├── lib/                          # Utility functions
    └── ui/                           # shadcn-ui components, common UI

supabase/
└── migrations/                       # SQL migration files
```

### Component Architecture
- **All components must be client components**: Use `"use client"` directive at the top of every component file
- **Next.js App Router**: Uses the modern App Router (not Pages Router)
- **Server/Client separation**: Use `"server-only"` package for server-specific code

### Page Components
- **Async params**: Page component params props MUST be promises and awaited
  ```tsx
  export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
  }
  ```

### Creating New Features (FSD Workflow)

When adding a new feature:

1. **Determine the appropriate layer**
   - User interaction? → `features/`
   - Business domain? → `entities/`
   - UI block? → `widgets/`

2. **Name the slice**
   - features: verb-noun format (create-account, filter-transactions)
   - entities: noun (user, product, order)
   - widgets: noun (header, sidebar, dashboard)

3. **Organize internal segments**
   - `model/` - State and business logic
   - `ui/` - Components
   - `api/` - API calls
   - `lib/` - Utilities

4. **Write Public API**
   - Add only explicit named exports to `index.ts`

### FSD Benefits
- Code changes are isolated to a single slice, limiting impact
- Minimizes code conflicts between team members
- Clear responsibility assignment for debugging
- Easy to test and delete features as units

### State Management Setup
- **React Query**: Pre-configured in `providers.tsx` with 60s staleTime
- **Theme Provider**: next-themes for dark/light mode support
- **Query Client**: Server/client split pattern implemented

## Library Usage

### Core Libraries
- **date-fns**: Date/time operations
- **ts-pattern**: Type-safe pattern matching
- **@tanstack/react-query**: Server state management
- **zustand**: Lightweight global state
- **react-use**: Common React hooks
- **es-toolkit**: Utility functions
- **lucide-react**: Icon components
- **zod**: Schema validation
- **react-hook-form**: Form management
- **framer-motion**: Animations
- **axios**: HTTP requests

### UI Components
- **shadcn-ui**: Pre-built accessible components in `src/components/ui/`
- **Tailwind CSS**: Utility-first styling
- When adding new shadcn components:
  ```bash
  npx shadcn@latest add [component-name]
  ```

## Code Style & Conventions

### Critical Rules
1. **Client-first**: Always use `"use client"` for components
2. **Early returns**: Prefer early returns over nested conditions
3. **Functional paradigm**: Pure functions, immutability, composition over inheritance
4. **Korean text handling**: Verify UTF-8 encoding doesn't break Korean characters
5. **Minimal changes**: Only modify what's necessary
6. **No premature optimization**: Profile before optimizing

### TypeScript Configuration
- Strict mode enabled (with `strictNullChecks: false`, `noImplicitAny: false`)
- Path alias: `@/*` maps to `./src/*`
- Target: ES2017

### Naming & Organization
- Descriptive variable/function names over comments
- Constants preferred over repeated values
- Group related functions together
- Higher-order functions first in file

### Error Handling
- Return errors over throwing exceptions when possible
- Use TODO: and FIXME: comments for known issues
- Validate inputs at system boundaries (user input, external APIs)
- Trust internal code - don't over-validate

## Supabase Integration

- **Do not run Supabase locally**
- Store migration queries in `.sql` files under `supabase/migrations/`
- Naming: `YYYYMMDDHHMMSS_description.sql`
- Example existing migration: `20260129000001_create_study_sessions.sql`

## Image Handling

- **Placeholder images**: Use valid picsum.photos URLs
- **Next.js Image**: Configured to allow all remote domains (`hostname: '**'`)

## Package Management

- **Use npm** as the package manager (not yarn, pnpm, or bun)

## ESLint Configuration

- ESLint ignores errors during builds (`ignoreDuringBuilds: true`)
- Next.js ESLint config extended

## Special Considerations

### EasyNext CLI Commands
The project uses the EasyNext CLI for additional setup:
```bash
# Install/update
npm i -g @easynext/cli@latest

# Add Supabase
easynext supabase

# Add authentication
easynext auth
easynext auth idpw    # ID/Password login
easynext auth kakao   # Kakao login

# Add services
easynext gtag         # Google Analytics
easynext clarity      # Microsoft Clarity
easynext channelio    # ChannelIO
easynext sentry       # Sentry
easynext adsense      # Google Adsense
```

### Theme System
- Uses next-themes with system default
- Configured in `providers.tsx` with `suppressHydrationWarning` on html element
- Class-based theme switching

### Font Configuration
- Geist Sans and Geist Mono from next/font/google
- CSS variables: `--font-geist-sans`, `--font-geist-mono`
