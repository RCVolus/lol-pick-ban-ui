import winston, { Logger } from 'winston';
import GlobalContext from '../GlobalContext';

const loggers: Logger[] = [];

const customFormat = winston.format.printf(
  ({ level, message, label, timestamp }) =>
    `${timestamp} [${level.padEnd(15)}] ${`\u001b[95m${label}\u001b[39m`.padEnd(
      22
    )}: ${message}`
);

const createLogger = (label: string): Logger => {
  const logger = winston.createLogger({
    level: GlobalContext.commandLine.debug
      ? 'debug'
      : process.env.LOGLEVEL || 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      customFormat
    ),
    defaultMeta: { label },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      // new winston.transports.File({ filename: 'error.log', level: 'error' }),
      // new winston.transports.File({ filename: 'combined.log' })
      new winston.transports.Console(),
    ],
  });
  loggers.push(logger);
  return logger;
};

const setLogLevel = (level: string) => {
  loggers.forEach((logger) => {
    logger.level = level;
  });
};

export default (label: string): Logger => createLogger(label);
export { setLogLevel };
