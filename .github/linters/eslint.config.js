import js from "@eslint/js";
import github from "eslint-plugin-github";
import jest from "eslint-plugin-jest";
import babelParser from "@babel/eslint-parser";
import prettier from "eslint-plugin-prettier";

// ESLint flat config expects an array of config objects
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
  js.configs.recommended,
  github.configs.recommended,
  jest.configs.recommended,
];
