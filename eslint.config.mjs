import js from "@eslint/js";
import * as tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      ".vscode/**",
      ".prettierrc.json",
      "eslint.config.mjs",
      "package-lock.json",
      "package.json",
      "tsconfig.json",
      "webpack.config.cjs",
      "./src/ts/types.ts",
      "./src/ts/EventObserver.ts",
      "./src/ts/PixiExtention.ts"
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": {
        rules: tseslint.rules,
      },
    },
    rules: {
      "no-undef": "warn",
    },
  },
  prettier,
];