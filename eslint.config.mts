import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
// import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      globals: globals.node,
      parser: tseslint.parser,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    ignores: ["node_modules", "dist"],
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      semi: ["error", "always"],
      // ...prettierConfig.rules,
      // "prettier/prettier": "error",
    },
  },
]);
