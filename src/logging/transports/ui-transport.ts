
import { LogEntry } from '../types';
import { Transport } from './transport';

interface UiTransportOptions {
  maxLogs?: number;
  target?: string;
}

/**
 * Transport for UI display of logs
 */
export class UiTransport implements Transport {
  private logs: LogEntry[] = [];
  private options: UiTransportOptions;
  private subscribers: ((logs: LogEntry[]) => void)[] = [];
  
  constructor(options: UiTransportOptions = {}) {
    this.options = {
      maxLogs: 100,
      ...options
    };
  }
  
  log(entry: LogEntry): void {
    // Add to logs at the beginning (newest first)
    this.logs.unshift(entry);
    
    // Limit size
    if (this.options.maxLogs && this.logs.length > this.options.maxLogs) {
      this.logs = this.logs.slice(0, this.options.maxLogs);
    }
    
    // Notify subscribers
    this.subscribers.forEach(callback => callback(this.logs));
    
    // Update UI if target exists
    this.updateUI();
  }
  
  getLogs(): LogEntry[] {
    return this.logs;
  }
  
  clear(): void {
    this.logs = [];
    this.updateUI();
    
    // Notify subscribers
    this.subscribers.forEach(callback => callback(this.logs));
  }
  
  subscribe(callback: (logs: LogEntry[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Call immediately with current logs
    callback(this.logs);
    
    // Return unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }
  
  private updateUI(): void {
    // Implementation would depend on the specific UI framework
    if (typeof document === 'undefined' || !this.options.target) {
      return;
    }
    
    const target = document.getElementById(this.options.target);
    if (!target) {
      return;
    }
    
    // Simple implementation - in practice, would use a framework renderer
    target.innerHTML = this.logs
      .map(log => `<div class="log-entry log-${log.level}">${new Date(log.timestamp).toISOString()} [${log.level.toUpperCase()}] ${String(log.message)}</div>`)
      .join('');
  }
}
