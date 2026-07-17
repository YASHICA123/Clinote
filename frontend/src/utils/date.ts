/**
 * Format a Date object or ISO string to standard Clinote format
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  return d.toLocaleDateString('en-US', options);
}

export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return d.toLocaleDateString('en-US', options);
}
