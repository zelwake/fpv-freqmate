// https://docs.expo.dev/guides/using-eslint/
import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import pluginQuery from '@tanstack/eslint-plugin-query';

export default defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  ...pluginQuery.configs['flat/recommended'],
]);
