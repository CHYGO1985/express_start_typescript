import appRootPath from 'app-root-path'
import winston, { format, transports } from 'winston'
import path from 'path'

// Defint custom colors for log levels
const colors: Record<string, string> = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

winston.addColors(colors)

// Create the logger with custom settings
const logger = winston.createLogger({
  level: 'http',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    format.json(),
    format.metadata(), // Store the error object in the metadata field
  ),
  defaultMeta: { service: 'main-service' },
  transports: [
    new transports.File({
      filename: path.join(appRootPath.toString(), '/logs/error.log'),
      level: 'error',
    }),
    new transports.File({ filename: path.join(appRootPath.toString(), '/logs/combined.log') }),
    // new transports.MongoDB({
    //   level: 'http',
    //   db: mongodbConnect,
    //   collection: 'SystemLogs',
    //   capped: true,
    // }),
  ],
})

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize({ all: true }),
        format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        format.simple(),
      ),
    }),
  )
}

// Define the stream for logging HTTP requests
;(logger as any).stream = {
  write: (message: string): void => {
    logger.http(message.trim())
  },
}

export default logger
