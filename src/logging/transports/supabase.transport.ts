import { LogEntry, LogTransport } from '../types';
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Supabase transport for logging
 */
export const supabaseTransport: LogTransport = {
  log: async (entry: LogEntry) => {
    try {
      // Process log entry before sending to Supabase
      const logData = processLogEntry(entry);
      
      // Insert log entry into Supabase
      const { error } = await supabase
        .from('logs')
        .insert([logData]);
      
      if (error) {
        console.error('Failed to send log to Supabase:', error);
      }
    } catch (error) {
      console.error('Error sending log to Supabase:', error);
    }
  }
};

/**
 * Process log entry before sending to Supabase
 */
function processLogEntry(entry: LogEntry): any {
  // Create a copy of the entry to avoid direct modification
  const { id, message, details, tags, ...rest } = entry;
  
  // Format timestamp properly
  let timestamp = entry.timestamp;
  if (timestamp) {
    // Ensure timestamp is a string
    if (typeof timestamp !== 'string') {
      try {
        // If it's a Date object, convert to ISO string
        if (timestamp instanceof Date) {
          timestamp = timestamp.toISOString();
        } else {
          // If it's another object, convert to string
          timestamp = String(timestamp);
        }
      } catch {
        // Fallback to current time if conversion fails
        timestamp = new Date().toISOString();
      }
    }
  } else {
    // Set default timestamp if missing
    timestamp = new Date().toISOString();
  }
  
  // Format message
  const messageText = typeof message === 'string' ? message : JSON.stringify(message);
  
  // Process details
  const detailsJson = details ? JSON.stringify(details) : null;
  
  // Process tags
  const tagsArray = Array.isArray(tags) ? tags : [];
  const tagsString = tagsArray.join(',');
  
  // Return formatted data
  return {
    ...rest,
    timestamp,
    message: messageText,
    details: detailsJson,
    tags: tagsString
  };
}
