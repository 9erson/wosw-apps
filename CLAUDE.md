# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.6 application using the App Router architecture with TypeScript, Tailwind CSS v4, and ESLint.

## Key Commands

```bash
# Development
npm run dev          # Start development server with Turbopack on http://localhost:3000

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint checks
```

## Architecture

### Framework Configuration
- **Next.js App Router**: All routes are defined in the `/app` directory
- **TypeScript**: Strict mode enabled with ES2017 target
- **Tailwind CSS v4**: Using `@tailwindcss/postcss` plugin (no traditional config file)
- **Path Alias**: `@/*` maps to root directory for imports

### Project Structure
- `/app`: App Router pages, layouts, and components
  - `layout.tsx`: Root layout with Geist fonts
  - `page.tsx`: Home page component
  - `globals.css`: Global styles with Tailwind directives
- Configuration files at root level (next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs)

### Styling Approach
- Tailwind CSS v4 with PostCSS configuration
- Geist and Geist Mono fonts loaded via next/font/google
- CSS variables for font families: `--font-geist-sans` and `--font-geist-mono`

### Development Notes
- No test framework configured yet
- No src directory - all code lives at project root
- ESLint configured with Next.js Core Web Vitals and TypeScript rules