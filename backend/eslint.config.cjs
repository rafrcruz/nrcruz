const js = require('@eslint/js');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const globals = require('globals');

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['dist'],
  },
  js.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      'no-console': isProduction ? 'warn' : 'off',
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.test.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.vitest,
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
];
