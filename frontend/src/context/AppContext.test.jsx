import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { AppProvider, ensureAppContext, useAppContext } from './AppContext';
import { config } from '../config/env';

describe('AppContext', () => {
  it('provides application configuration', () => {
    const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.env).toBe(config.env);
    expect(result.current.apiBaseUrl).toBe(config.api.baseUrl);
    expect(result.current.config).toBe(config);
  });

  it('throws when used outside of provider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => ensureAppContext(null)).toThrow(
      'useAppContext must be used within an AppProvider'
    );
    consoleErrorSpy.mockRestore();
  });
});
