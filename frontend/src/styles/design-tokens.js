import designTokens from './design-tokens.json';

// Central design tokens for the frontend design system.
// Tailwind consumes the raw JSON while app code imports this module for a typed-friendly interface.
export const { colors, typography, spacing, radii, states } = designTokens;

export default designTokens;
