const rawApiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3001';
const apiBaseUrl = rawApiBaseUrl?.trim();

if (!apiBaseUrl && import.meta.env?.DEV) {
  throw new Error('VITE_API_BASE_URL is required to run the frontend');
}

export const config = {
  env: import.meta.env?.MODE || 'development',
  api: {
    baseUrl: apiBaseUrl || '',
  },
};
