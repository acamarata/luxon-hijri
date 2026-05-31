import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import { typescript } from '@acamarata/eslint-config';

export default [
  {
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    files: ['src/**/*.ts'],
  },
  ...typescript.map((config) => ({ ...config, files: ['src/**/*.ts'] })),
  eslintConfigPrettier,
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', 'test.mjs', 'test-cjs.cjs', 'test-crossval.mjs', 'tsup.config.ts', 'typedoc.json'],
  },
];
