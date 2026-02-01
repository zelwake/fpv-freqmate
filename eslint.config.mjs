// https://docs.expo.dev/guides/using-eslint/
import pluginQuery from '@tanstack/eslint-plugin-query';
import expoConfig from 'eslint-config-expo/flat.js';
import RNTLConfig from 'eslint-plugin-testing-library';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      'prefer-template': 'error',
    },
  },
  ...pluginQuery.configs['flat/recommended'],
  {
    ...RNTLConfig.configs['flat/react'],
    files: ['*test.tsx', '*test.ts'],
  },
]);
