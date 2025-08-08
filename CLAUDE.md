# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.4.6 application using the App Router architecture with TypeScript, Tailwind CSS v4, daisyUI, and ESLint.

## Key Commands

```bash
# Development
pnpm dev             # Start development server with Turbopack on http://localhost:3000

# Production
pnpm build           # Build for production
pnpm start           # Start production server

# Code Quality
pnpm lint            # Run ESLint checks

# Package Management
pnpm install         # Install dependencies
pnpm add <package>   # Add new dependency
pnpm add -D <package> # Add new dev dependency
```

## Architecture

### Framework Configuration
- **Next.js App Router**: All routes are defined in the `/app` directory
- **TypeScript**: Strict mode enabled with ES2017 target
- **Tailwind CSS v4**: Using `@tailwindcss/postcss` plugin (no traditional config file)
- **daisyUI**: Component library for Tailwind CSS (see Styling section)
- **Path Alias**: `@/*` maps to root directory for imports

### Project Structure
- `/app`: App Router pages, layouts, and components
  - `layout.tsx`: Root layout with Geist fonts
  - `page.tsx`: Home page component
  - `globals.css`: Global styles with Tailwind directives and daisyUI
- Configuration files at root level (next.config.ts, tsconfig.json, eslint.config.mjs, postcss.config.mjs)

### Styling Approach

#### Tailwind CSS v4 + daisyUI
- Using Tailwind CSS v4 with PostCSS configuration
- daisyUI provides pre-built component classes and themes
- Geist and Geist Mono fonts loaded via next/font/google
- CSS variables for font families: `--font-geist-sans` and `--font-geist-mono`

#### daisyUI Setup
To use daisyUI, first install it:
```bash
pnpm add -D daisyui@latest
```

Then add it to your `app/globals.css`:
```css
@import "tailwindcss";
@plugin "daisyui";
```

#### daisyUI Usage
daisyUI provides semantic component classes that work alongside Tailwind utilities:
```jsx
// Button examples
<button className="btn">Default</button>
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>

// Card example
<div className="card bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">Card title</h2>
    <p>Card content</p>
  </div>
</div>

// Form elements
<input type="text" placeholder="Type here" className="input input-bordered" />
<select className="select select-bordered">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

#### Available Themes
daisyUI includes many built-in themes: light, dark, cupcake, bumblebee, emerald, corporate, synthwave, retro, cyberpunk, valentine, halloween, garden, forest, aqua, lofi, pastel, fantasy, wireframe, black, luxury, dracula, cmyk, autumn, business, acid, lemonade, night, coffee, winter, dim, nord, sunset, and more.

To use a theme, add `data-theme` attribute to your HTML:
```jsx
<html data-theme="cupcake">
```

### Development Notes
- Package manager: pnpm (not npm)
- No test framework configured yet
- No src directory - all code lives at project root
- ESLint configured with Next.js Core Web Vitals and TypeScript rules