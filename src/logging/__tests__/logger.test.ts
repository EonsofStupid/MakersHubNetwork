
import { LoggerService } from '../logger.service';
import { LogCategory, LogLevel } from '../types';
import { isLogLevelAtLeast } from '../constants/log-level';
import { v4 as uuidv4 } from 'uuid';

// Mock the UUID module
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid')
}));

describe('LoggerService', () => {
  // Mock transport to verify logs
  const mockTransport = {
    log: jest.fn()
  };
  
  // Create a logger instance with the mock transport
  let logger: LoggerService;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create a new logger for each test
    logger = new LoggerService({
      minLevel: LogLevel.DEBUG,
      transports: [mockTransport],
      bufferSize: 1, // Immediate flush
      flushInterval: 0
    });
  });
  
  test('logs with the correct level and category', () => {
    // Test debug level
    logger.debug('Test debug message', { category: LogCategory.SYSTEM });
    expect(mockTransport.log).toHaveBeenCalledWith(expect.objectContaining({
      level: LogLevel.DEBUG,
      category: LogCategory.SYSTEM,
      message: 'Test debug message'
    }));
    
    // Test info level
    logger.info('Test info message', { category: LogCategory.NETWORK });
    expect(mockTransport.log).toHaveBeenCalledWith(expect.objectContaining({
      level: LogLevel.INFO,
      category: LogCategory.NETWORK,
      message: 'Test info message'
    }));
    
    // Test error level
    logger.error('Test error message', { category: LogCategory.AUTH });
    expect(mockTransport.log).toHaveBeenCalledWith(expect.objectContaining({
      level: LogLevel.ERROR,
      category: LogCategory.AUTH,
      message: 'Test error message'
    }));
  });
  
  test('respects minimum log level', () => {
    // Update config to only show warnings and above
    logger.updateConfig({ minLevel: LogLevel.WARN });
    
    // This should not be logged
    logger.debug('Debug message that should be filtered');
    logger.info('Info message that should be filtered');
    
    // These should be logged
    logger.warn('Warning message');
    logger.error('Error message');
    
    // Check that only the appropriate logs were sent
    expect(mockTransport.log).not.toHaveBeenCalledWith(expect.objectContaining({
      level: LogLevel.DEBUG
    }));
    expect(mockTransport.log).not.toHaveBeenCalledWith(expect.objectContaining({
      level: LogLevel.INFO
    }));
    expect(mockTransport.log).toHaveBeenCalledWith(expect.objectContaining({
      level: LogLevel.WARN
    }));
    expect(mockTransport.log).toHaveBeenCalledWith(expect.objectContaining({
      level: LogLevel.ERROR
    }));
  });
  
  test('handles user ID correctly', () => {
    const userId = 'test-user-123';
    logger.setUserId(userId);
    
    // Enable including user ID
    logger.updateConfig({ includeUser: true });
    
    logger.info('Test message with user ID');
    expect(mockTransport.log).toHaveBeenCalledWith(expect.objectContaining({
      userId
    }));
    
    // Disable including user ID
    logger.updateConfig({ includeUser: false });
    
    logger.info('Test message without user ID');
    expect(mockTransport.log).toHaveBeenCalledWith(expect.not.objectContaining({
      userId
    }));
  });
  
  test('generates performance logs correctly', () => {
    const duration = 150;
    logger.performance('Performance test', duration, { category: LogCategory.PERFORMANCE });
    
    // For short durations, it should use INFO level
    expect(mockTransport.log).toHaveBeenCalledWith(expect.objectContaining({
      level: LogLevel.INFO,
      category: LogCategory.PERFORMANCE,
      message: 'Performance test',
      details: expect.objectContaining({ duration })
    }));
    
    // For longer durations, it should use WARN level
    const longDuration = 1500;
    logger.performance('Slow operation', longDuration);
    
    expect(mockTransport.log).toHaveBeenCalledWith(expect.objectContaining({
      level: LogLevel.WARN,
      message: 'Slow operation',
      details: expect.objectContaining({ duration: longDuration })
    }));
  });
  
  test('isLogLevelAtLeast utility works correctly', () => {
    expect(isLogLevelAtLeast(LogLevel.INFO, LogLevel.DEBUG)).toBe(true);
    expect(isLogLevelAtLeast(LogLevel.ERROR, LogLevel.WARN)).toBe(true);
    expect(isLogLevelAtLeast(LogLevel.DEBUG, LogLevel.INFO)).toBe(false);
    expect(isLogLevelAtLeast(LogLevel.WARN, LogLevel.ERROR)).toBe(false);
    expect(isLogLevelAtLeast(LogLevel.INFO, LogLevel.INFO)).toBe(true);
  });
});
