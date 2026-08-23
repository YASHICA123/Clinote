/**
 * Formats time from Date object or ISO string to HH:MM AM/PM format
 */
export function formatTime(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  return d.toLocaleTimeString('en-US', options);
}

export function getRelativeTimeString(timestamp: string): string {
  // Simple parser/formatter for relative times or timestamps
  if (timestamp.includes('ago')) return timestamp;
  return timestamp;
}
