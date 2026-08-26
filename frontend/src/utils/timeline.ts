import type { TimelineEvent } from '../types';

/**
 * Sorts timeline events descending or ascending by date/timestamp
 */
export function sortTimelineEvents(events: TimelineEvent[], order: 'asc' | 'desc' = 'desc'): TimelineEvent[] {
  return [...events].sort((a, b) => {
    const strA = a.created_at || a.timestamp || '';
    const strB = b.created_at || b.timestamp || '';
    const timeA = strA ? new Date(strA).getTime() : 0;
    const timeB = strB ? new Date(strB).getTime() : 0;
    
    // Fallback if parsing fails
    if (isNaN(timeA) || isNaN(timeB)) {
      return order === 'desc' 
        ? strB.localeCompare(strA) 
        : strA.localeCompare(strB);
    }
    
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });
}
