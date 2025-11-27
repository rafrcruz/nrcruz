const js = require('@eslint/js');
const jsxA11y = require('eslint-plugin-jsx-a11y');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const globals = require('globals');

const reactRecommended = react.configs.flat.recommended;
const reactHooksRecommended = reactHooks.configs.recommended;

const jsxA11yWarnRules = [
  'jsx-a11y/alt-text',
  'jsx-a11y/anchor-ambiguous-text',
  'jsx-a11y/anchor-has-content',
  'jsx-a11y/anchor-is-valid',
  'jsx-a11y/aria-activedescendant-has-tabindex',
  'jsx-a11y/aria-props',
  'jsx-a11y/aria-proptypes',
  'jsx-a11y/aria-role',
  'jsx-a11y/aria-unsupported-elements',
  'jsx-a11y/autocomplete-valid',
  'jsx-a11y/click-events-have-key-events',
  'jsx-a11y/control-has-associated-label',
  'jsx-a11y/heading-has-content',
  'jsx-a11y/html-has-lang',
  'jsx-a11y/iframe-has-title',
  'jsx-a11y/img-redundant-alt',
  'jsx-a11y/interactive-supports-focus',
  'jsx-a11y/label-has-associated-control',
  'jsx-a11y/label-has-for',
  'jsx-a11y/media-has-caption',
  'jsx-a11y/mouse-events-have-key-events',
  'jsx-a11y/no-access-key',
  'jsx-a11y/no-autofocus',
  'jsx-a11y/no-distracting-elements',
  'jsx-a11y/no-interactive-element-to-noninteractive-role',
  'jsx-a11y/no-noninteractive-element-interactions',
  'jsx-a11y/no-noninteractive-element-to-interactive-role',
  'jsx-a11y/no-noninteractive-tabindex',
  'jsx-a11y/no-redundant-roles',
  'jsx-a11y/no-static-element-interactions',
  'jsx-a11y/role-has-required-aria-props',
  'jsx-a11y/role-supports-aria-props',
  'jsx-a11y/scope',
  'jsx-a11y/tabindex-no-positive',
];

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    ignores: ['dist', 'build'],
  },
  js.configs.recommended,
  prettierRecommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ...reactRecommended.languageOptions,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...(reactRecommended.languageOptions?.globals ?? {}),
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactRecommended.rules,
      ...reactHooksRecommended.rules,
      ...Object.fromEntries(jsxA11yWarnRules.map(rule => [rule, 'warn'])),
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      ...reactRecommended.settings,
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.test.{js,jsx}', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.vitest,
      },
    },
    rules: {
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },
  {
    files: [
      '*.config.js',
      '*.config.cjs',
      'postcss.config.js',
      'tailwind.config.js',
      'vite.config.mjs',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
