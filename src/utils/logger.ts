import path from 'path';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ level, message, stack, timestamp, ...meta }) => {
    let log = `${timestamp as string} [${level}]: ${message as string}`;

    // Add metadata in a single line format
    if (Object.keys(meta).length > 0) {
      const metaString = Object.entries(meta)
        .map(([key, value]) => `${key}=${String(value)}`)
        .join(' ');
      log += ` | ${metaString}`;
    }

    if (stack) {
      log += `\n${stack as string}`;
    }

    return log;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Define log levels
const levels = {
  debug: 4,
  error: 0,
  http: 3,
  info: 2,
  warn: 1,
};

// Define colors for each level
const colors = {
  debug: 'white',
  error: 'red',
  http: 'magenta',
  info: 'green',
  warn: 'yellow',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV ?? 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
  }),

  // Error log file with daily rotation
  new DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    filename: path.join(logsDir, 'error-%DATE%.log'),
    format: fileFormat,
    level: 'error',
    maxFiles: '14d', // Keep logs for 14 days
    maxSize: '20m', // 20MB max file size
    zippedArchive: true, // Compress old logs
  }),

  // Combined log file with daily rotation
  new DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    format: fileFormat,
    maxFiles: '14d', // Keep logs for 14 days
    maxSize: '20m', // 20MB max file size
    zippedArchive: true, // Compress old logs
  }),
];

// Create the logger
const logger = winston.createLogger({
  exitOnError: false,
  level: level(),
  levels,
  transports,
});

// Create a stream object for Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Export logger instance
export default logger;
