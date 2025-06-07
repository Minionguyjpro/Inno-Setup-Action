import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

import js from "@eslint/js";
import github from "eslint-plugin-github";
import jest from "eslint-plugin-jest";
import babelParser from "@babel/eslint-parser";
import prettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
});

export default [
  // Convert legacy configs
  ...compat.extends("eslint:recommended", "prettier"),

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
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-env"],
        },
      },
      globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
      },
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
      "import/no-commonjs": "error",
      "import/no-namespace": "off",
      "no-console": "off",
      "no-unused-vars": "off",
      "prettier/prettier": "error",
      semi: "off",
    },
  },

  js.configs.recommended,
  github.configs.recommended,
  jest.configs.recommended,
];
