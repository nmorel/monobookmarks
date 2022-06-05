const prettierConfig = require('@nimo/config-prettier')

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    'prettier/prettier': ['error', prettierConfig],
  },
  overrides: [
    {
      files: ['*.js'],
      extends: ['plugin:node/recommended'],
      parserOptions: {
        allowImportExportEverywhere: true,
        ecmaVersion: 2021,
        sourceType: 'module',
      },
      rules: {
        'no-restricted-syntax': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['src/**'],
      extends: ['plugin:react/recommended'],
      plugins: ['react', 'react-hooks'],
      rules: {
        'react/react-in-jsx-scope': 0,
        '@typescript-eslint/ban-types': 0,
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
  ],
}
