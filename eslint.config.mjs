import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import security from 'eslint-plugin-security';
import unicorn from 'eslint-plugin-unicorn';

/**
 * Flat config. eslint-config-next 16 already bundles `eslint-plugin-jsx-a11y`
 * and `eslint-plugin-import` — re-declaring them here triggers "Cannot
 * redefine plugin" in ESLint 9. We layer on unicorn (style) and security
 * (audit) — both are required by §20.
 *
 * Disabled unicorn rules below are intentional, not laziness:
 *   • `consistent-function-scoping` — false-positive on test helpers and
 *     local closures that close over mocks.
 *   • `no-await-expression-member` — Next 16 server components routinely
 *     read `.locale` etc. directly off async params; rewriting every
 *     `(await x).y` to a two-line const ladder adds noise without value.
 *   • `prefer-global-this` — `window` reads better in browser code; we
 *     guard for SSR explicitly where it matters (env.ts).
 *   • `prefer-module` — kept off for vitest.config.ts which legitimately
 *     uses `__dirname`.
 *
 * Disabled security rules below — same logic, intentional:
 *   • `detect-object-injection` — fires on any `obj[key]` access, including
 *     fully type-safe ones (e.g. record keyed by an enum). The false-
 *     positive rate is high enough to drown out real findings. We rely on
 *     TypeScript's `noUncheckedIndexedAccess` + Zod input validation
 *     (§13) for the actual injection surface (user-supplied keys).
 *   • `detect-non-literal-fs-filename` — Vitest config legitimately reads
 *     fs paths from dynamic values; same for the seed script.
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  unicorn.configs['flat/recommended'],
  security.configs.recommended,
  {
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          // `_v`, `_c`, `_ch` — destructure-to-discard pattern in CTAButton.
          // Underscore-prefix is the conventional signal "intentional discard".
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [{ pattern: '@/**', group: 'internal', position: 'before' }],
        },
      ],
      'import/no-default-export': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-null': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-module': 'off',
      'unicorn/import-style': 'off',
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  {
    // Tests run in a trusted dev/CI context against a server WE control —
    // there is no untrusted regex source. The two rules below routinely
    // false-flag Playwright URL assertions and test helpers that build
    // a regex from a typed test-fixture parameter.
    files: ['tests/**/*.{ts,tsx}', 'src/**/*.{test,spec}.{ts,tsx}'],
    rules: {
      'security/detect-non-literal-regexp': 'off',
      'security/detect-unsafe-regex': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/payload-types.ts',
    'src/app/(payload)/**',
  ]),
]);
