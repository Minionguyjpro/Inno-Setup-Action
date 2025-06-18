import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

import github from "eslint-plugin-github";
import jest from "eslint-plugin-jest";
import babelParser from "@babel/eslint-parser";
import prettier from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
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
      import: importPlugin,
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
];
