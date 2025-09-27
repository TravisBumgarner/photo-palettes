// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  globalIgnores(["dist-web", "dist-native", "ios", "android"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "no-alert": "error",
      "no-restricted-imports": [
        "error",
        {
          patterns: [{ regex: "^@mui/[^/]+$" }],
        },
      ],
      "no-console": "error",
      "no-restricted-syntax": [
        "error",
        {
          selector: "MemberExpression[property.name='env']",
          message: "Use import.meta.env only in src/config.ts",
        },
      ],
    },
  },
  {
    files: ["src/config.ts"],
    rules: {
      "no-restricted-syntax": "off",
    },
  },
]);
