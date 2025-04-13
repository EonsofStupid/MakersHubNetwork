
import { LogEntry } from '@/shared/types/shared.types';

export interface Transport {
  log(entry: LogEntry): void;
  query(options?: any): Promise<LogEntry[]>;
  clear(): void;
}

export class BaseTransport implements Transport {
  log(entry: LogEntry): void {
    throw new Error('Method not implemented.');
  }
  
  async query(options?: any): Promise<LogEntry[]> {
    throw new Error('Method not implemented.');
  }
  
  clear(): void {
    throw new Error('Method not implemented.');
  }
}
