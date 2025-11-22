import { theme as flowbiteBaseTheme } from 'flowbite-react';
import tokens from './design-tokens';

// Flowbite theme aligned with the design tokens so that UI kit components
// and Tailwind utilities share the same source of truth.
export const flowbiteTheme = {
  ...flowbiteBaseTheme,
  button: {
    ...flowbiteBaseTheme.button,
    color: {
      ...flowbiteBaseTheme.button.color,
      primary:
        'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-200 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-300',
      blue:
        'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-200 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-primary-300',
      secondary:
        'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-200 dark:bg-secondary-500 dark:hover:bg-secondary-600 dark:focus:ring-secondary-300',
    },
  },
  card: {
    ...flowbiteBaseTheme.card,
    root: {
      ...flowbiteBaseTheme.card.root,
      base: 'flex rounded-lg border border-neutral-800 bg-neutral-900/60 p-4 shadow-md backdrop-blur-sm',
    },
  },
  textInput: {
    ...flowbiteBaseTheme.textInput,
    field: {
      ...flowbiteBaseTheme.textInput.field,
      input: {
        ...flowbiteBaseTheme.textInput.field.input,
        colors: {
          ...flowbiteBaseTheme.textInput.field.input.colors,
          info:
            'border-primary-300 bg-neutral-900/50 text-neutral-100 placeholder-neutral-400 focus:border-primary-300 focus:ring-primary-300 dark:border-neutral-500 dark:bg-neutral-900/70 dark:text-neutral-100',
        },
      },
    },
  },
};

export const designTokens = tokens;
