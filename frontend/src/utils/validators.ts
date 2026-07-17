/**
 * Validation utilities
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function isRequired(val: any): boolean {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  return true;
}
