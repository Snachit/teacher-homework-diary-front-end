# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Homework Diary front-end application built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Build & Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run linter
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui (new-york style, lucide icons)
- **Path Aliases**: `@/` prefix

## Design System

### Colors
- Background: Pure black (`#000000`)
- Primary Accent: Violet (`#8b5cf6`)
- Text: White with opacity variations (`text-white`, `text-white/70`)
- Use CSS variables: `bg-background`, `text-foreground`, `bg-primary`

### Typography
- **Figtree**: Default sans-serif for body text and UI
- **Instrument Serif**: For emphasis and titles (use `.instrument` class)
- Pattern: Light font weights (300-400) with tight tracking

### Component Patterns
- Use `"use client"` directive for components with state/effects
- Buttons: Rounded-full with hover transitions
- Cards: Use `backdrop-blur-md bg-white/20 rounded-3xl`
- Animations: IntersectionObserver for scroll-triggered animations with staggered delays

## File Organization

- `components/` - Section components
- `components/ui/` - Reusable UI components (shadcn)
- Naming: lowercase-with-hyphens (`hero-content.tsx`)

## Adding shadcn Components

```bash
npx shadcn@latest add <component-name>
```
