import type { TimelineEvent } from '../types';

/**
 * Sorts timeline events descending or ascending by date/timestamp
 */
export function sortTimelineEvents(events: TimelineEvent[], order: 'asc' | 'desc' = 'desc'): TimelineEvent[] {
  return [...events].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    
    // Fallback if parsing fails
    if (isNaN(timeA) || isNaN(timeB)) {
      return order === 'desc' 
        ? b.timestamp.localeCompare(a.timestamp) 
        : a.timestamp.localeCompare(b.timestamp);
    }
    
    return order === 'desc' ? timeB - timeA : timeA - timeB;
  });
}
