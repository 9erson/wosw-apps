import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom', // Using happy-dom which is already installed
    globals: true,
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        '.next/',
        'out/',
        '**/*.config.{js,ts,mjs}',
        '**/*.d.ts',
        'vitest.setup.ts',
        '**/__tests__/**',
        '**/*.test.{js,ts,tsx}',
        '**/*.spec.{js,ts,tsx}',
        'coverage/',
        'prisma/',
        'public/',
        'app/globals.css'
      ],
      thresholds: {
        global: {
          lines: 80,
          branches: 70,
          functions: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})