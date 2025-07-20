// eslint.config.cjs  — CommonJS flat‑config для ESLint 9+

const js = require("@eslint/js");
const nodePlugin = require("eslint-plugin-node");

/* базовый preset */
const recommended = js.configs.recommended;

/* берём глобалы из presets, если есть */
const baseGlobals =
  (recommended.languageOptions && recommended.languageOptions.globals) || {};

module.exports = [
  recommended,

  {
    files: ["**/*.js"],
    plugins: { node: nodePlugin },

    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...baseGlobals,
        require: "readonly",
        module: "readonly",
        process: "readonly",
        __dirname: "readonly",
        Buffer: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        URL: "readonly",
        AbortController: "readonly",
        fetch: "readonly",
        global: "readonly",
      },
    },

    rules: {
      "no-unused-expressions": "off",
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      "no-sync": "warn",
      "no-process-exit": "warn",
      "prefer-destructuring": "off",
      "new-cap": ["warn", { capIsNew: false }],
    },
  },

  {
    ignores: ["node_modules/**", "**/eslint.config.*", "**/*.config.js"],
  },
];
