/**
 * Application global service configuration
 */
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  environment: import.meta.env.MODE || 'development',
  isDev: import.meta.env.DEV,
  version: '1.0.0',
};
