import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import { typescript } from '@acamarata/eslint-config';

export default [
  {
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: { parser: tsParser },
  },
  ...typescript,
  eslintConfigPrettier,
  {
    ignores: ['dist/', 'node_modules/', '*.cjs', '*.mjs'],
  },
];
