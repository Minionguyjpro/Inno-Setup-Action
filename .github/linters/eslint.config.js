import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

import js from "@eslint/js";
import github from "eslint-plugin-github";
import jest from "eslint-plugin-jest";
import babelParser from "@babel/eslint-parser";
import prettier from "eslint-plugin-prettier";

// Make __dirname available
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup FlatCompat to use legacy shareable configs if needed
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ESLint flat config expects an array of config objects
export default [
  // FlatCompat usage to extend from old-style configs, if needed
  ...compat.extends("eslint-config-my-config"), // <-- adjust or remove if not needed

  // Direct flat config for your JS files
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ignores: [
      "!.*",
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "*.json",
    ],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
      parser: babelParser,
    },
    plugins: {
      github,
      jest,
      prettier,
    },
    rules: {
      camelcase: "off",
      "eslint-comments/no-use": "off",
      "eslint-comments/no-unused-disable": "off",
      "i18n-text/no-en": "off",
      "import/no-commonjs": "error", // Enforce ES modules only
      "import/no-namespace": "off",
      "no-console": "off",
      "no-unused-vars": "off",
      "prettier/prettier": "error",
      semi: "off",
    },
    settings: {},
  },

  // Recommended configs from plugins/libraries
  js.configs.recommended,
  github.configs.recommended,
  jest.configs.recommended,
];
