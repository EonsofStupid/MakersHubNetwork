
import { LogEntry } from '../types';
import { memoryTransport } from '../transports/memory.transport';
import { getLogger } from '../service/logger.service';

/**
 * Safely retrieve logs from memory transport
 * Returns empty array if memoryTransport doesn't have getLogs method
 */
export function safeGetLogs(): LogEntry[] {
  try {
    if (typeof memoryTransport.getLogs === 'function') {
      return memoryTransport.getLogs();
    } else {
      getLogger('memoryTransportHelper').warn('memoryTransport.getLogs is not a function');
      return [];
    }
  } catch (error) {
    getLogger('memoryTransportHelper').error('Error calling memoryTransport.getLogs', {
      details: { error }
    });
    return [];
  }
}

/**
 * Safely clear logs from memory transport
 * No-op if memoryTransport doesn't have clear method
 */
export function safeClearLogs(): void {
  try {
    if (typeof memoryTransport.clear === 'function') {
      memoryTransport.clear();
    } else {
      getLogger('memoryTransportHelper').warn('memoryTransport.clear is not a function');
    }
  } catch (error) {
    getLogger('memoryTransportHelper').error('Error calling memoryTransport.clear', {
      details: { error }
    });
  }
}
