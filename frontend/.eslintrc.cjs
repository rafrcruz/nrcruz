// Basic a11y linting is enabled to keep JSX accessible; new components should follow these rules.
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

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['jsx-a11y'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist', 'build'],
  overrides: [
    {
      files: ['*.config.js', '*.config.cjs', 'postcss.config.js', 'tailwind.config.js'],
      env: {
        node: true,
      },
    },
    {
      files: ['**/*.test.{js,jsx,ts,tsx}', 'tests/**/*.js'],
      env: {
        node: true,
        browser: true,
        jest: true,
      },
      globals: {
        vi: 'readonly',
      },
      rules: {
        'react/prop-types': 'off',
        'react/display-name': 'off',
      },
    },
  ],
  rules: {
    ...Object.fromEntries(jsxA11yWarnRules.map((rule) => [rule, 'warn'])),
    'react/react-in-jsx-scope': 'off',
  },
};
