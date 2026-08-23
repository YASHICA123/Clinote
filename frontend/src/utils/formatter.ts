/**
 * Format string/number to structured forms
 */
export function formatMedicalId(id: string): string {
  if (id.length <= 4) return id;
  return `${id.slice(0, 3)}-${id.slice(3, 6)}-${id.slice(6)}`;
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}
