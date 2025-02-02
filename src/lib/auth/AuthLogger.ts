type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

export class AuthLogger {
  private static instance: AuthLogger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {}

  public static getInstance(): AuthLogger {
    if (!AuthLogger.instance) {
      AuthLogger.instance = new AuthLogger();
    }
    return AuthLogger.instance;
  }

  private formatLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.shift();
    }
    console.log(`[Auth ${entry.level.toUpperCase()}] ${entry.message}`, entry.data || '');
  }

  public info(message: string, data?: any): void {
    const entry = this.formatLogEntry('info', message, data);
    this.addLog(entry);
  }

  public warn(message: string, data?: any): void {
    const entry = this.formatLogEntry('warn', message, data);
    this.addLog(entry);
  }

  public error(message: string, data?: any): void {
    const entry = this.formatLogEntry('error', message, data);
    this.addLog(entry);
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

export const authLogger = AuthLogger.getInstance();