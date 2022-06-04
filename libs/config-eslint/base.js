const prettierConfig = require("@nimo/config-prettier");

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "prettier",
    "import",
  ],
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "prettier/prettier": ["error", prettierConfig],
  },
};
