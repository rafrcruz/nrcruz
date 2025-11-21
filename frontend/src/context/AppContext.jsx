import { createContext, useContext, useMemo } from 'react';
import { config } from '../config/env';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const value = useMemo(
    () => ({
      env: config.env,
      apiBaseUrl: config.api.baseUrl,
      config,
    }),
    []
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

export { AppContext };
