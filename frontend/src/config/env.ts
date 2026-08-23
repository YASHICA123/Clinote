/**
 * Structured Environment Variable exports
 */
export const ENV = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  ENV_MODE: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV,
} as const;
