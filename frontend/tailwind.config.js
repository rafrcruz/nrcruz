const tokens = require('./src/styles/design-tokens.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}', './node_modules/flowbite-react/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: tokens.colors.primary,
        secondary: tokens.colors.secondary,
        neutral: tokens.colors.neutral,
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        error: tokens.colors.error,
        info: tokens.colors.info,
        focus: tokens.colors.focus,
        outline: tokens.colors.outline,
      },
      fontFamily: {
        sans: tokens.typography.fontFamily,
      },
      fontSize: tokens.typography.fontSize,
      spacing: tokens.spacing,
      borderRadius: tokens.radii,
      boxShadow: {
        focus: `0 0 0 3px ${tokens.colors.focus}`,
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
