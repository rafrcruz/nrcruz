import { describe, expect, it } from 'vitest';
import { BaseCard, BaseContainer, PrimaryButton, TextInput } from './index';

describe('ui index exports', () => {
  it('re-exports all UI components', () => {
    expect(BaseCard).toBeTruthy();
    expect(BaseContainer).toBeTruthy();
    expect(PrimaryButton).toBeTruthy();
    expect(TextInput).toBeTruthy();
  });
});
