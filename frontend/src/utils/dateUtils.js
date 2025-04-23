import { format, parseISO } from 'date-fns';

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Format string for date-fns
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, formatStr = 'MMM d, yyyy h:mm a') => {
  try {
    if (!dateString) return '';
    
    // Handle both Date objects and ISO strings
    const date = typeof dateString === 'string' 
      ? parseISO(dateString) 
      : dateString;
      
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || '';
  }
};

/**
 * Get a color based on event type
 * @param {string} type - Event type
 * @returns {string} Color hex code
 */
export const getEventTypeColor = (type) => {
  switch (type) {
    case 'Merger':
      return '#1976d2'; // blue
    case 'Dividends':
      return '#2e7d32'; // green
    case 'New Capital':
      return '#0288d1'; // light blue
    case 'Hire':
      return '#ed6c02'; // orange
    default:
      return '#757575'; // grey
  }
};

/**
 * Check if two date ranges overlap
 * @param {Date} startA - Start date of first range
 * @param {Date} endA - End date of first range
 * @param {Date} startB - Start date of second range
 * @param {Date} endB - End date of second range
 * @returns {boolean} True if ranges overlap
 */
export const doDateRangesOverlap = (startA, endA, startB, endB) => {
  return startA <= endB && startB <= endA;
};
