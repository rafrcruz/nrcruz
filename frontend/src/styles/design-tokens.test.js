import { describe, expect, it } from 'vitest';
import rawTokens from './design-tokens.json';
import designTokens, { colors, spacing } from './design-tokens';

describe('design tokens', () => {
  it('exposes the same structure from JSON and module exports', () => {
    expect(designTokens).toEqual(rawTokens);
    expect(colors.primary['500']).toBe('#3b82f6');
    expect(spacing).toHaveProperty('xl', '1.5rem');
  });
});
