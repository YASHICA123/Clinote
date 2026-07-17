/**
 * LocalStorage wrapper service with JSON parsing/stringifying helpers
 */
export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(key);
      return val ? (JSON.parse(val) as T) : fallback;
    } catch (e) {
      console.warn(`Failed to parse storage key "${key}":`, e);
      return fallback;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to set storage key "${key}":`, e);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  },
};
