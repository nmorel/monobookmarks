module.exports = {
    extends: ["./base.js", "plugin:react/recommended"],
    plugins: ["react", "react-hooks"],
    rules: {
      "react/react-in-jsx-scope": 0,
      "@typescript-eslint/ban-types": 0,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  };
  