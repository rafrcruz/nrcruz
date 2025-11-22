// Central design tokens for the frontend design system.
// These values mirror the current visual identity so components can adopt them gradually
// without changing the existing look and feel.
// Usage guidelines:
// - Tailwind: use classes such as bg-primary-600, text-neutral-200, rounded-md, etc.
// - Flowbite: components inherit these tokens via the Flowbite provider declared in main.jsx.
// - CSS-in-JS or plain CSS: consume the CSS variables defined in global.css.
const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  secondary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#38bdf8',
  focus: '#bfdbfe',
  outline: '#93c5fd',
};

const typography = {
  fontFamily: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
  fontSize: {
    base: '1rem',
    sm: '0.875rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
};

const spacing = {
  xs: '0.25rem', // 1
  sm: '0.5rem', // 2
  md: '0.75rem', // 3
  lg: '1rem', // 4
  xl: '1.5rem', // 6
  '2xl': '2rem', // 8
};

const radii = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  pill: '9999px',
};

const states = {
  hover: colors.primary[600],
  focus: colors.focus,
  active: colors.primary[700],
  disabled: colors.neutral[500],
};

module.exports = {
  colors,
  typography,
  spacing,
  radii,
  states,
};
