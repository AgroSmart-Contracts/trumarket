import pino, { type Logger, type LoggerOptions } from 'pino';

import { config } from '../config';

const pinoOptions: LoggerOptions = { level: config.logLevel };
let pinoTransport: any;
let pinoLogger: Logger;

if (config.env === 'development' || config.prettyLogs) {
  pinoTransport = pino.transport({
    targets: [
      {
        target: 'pino-pretty',
        level: 'trace',
        options: {
          destination: config.logsDestination,
          colorize: true,
        },
      },
      {
        target: 'pino-pretty',
        level: 'trace',
        options: { destination: 1, colorize: true },
      },
    ],
  });
}

// eslint-disable-next-line
pinoLogger = pino(pinoOptions, pinoTransport);

export const loggerOptions = pinoOptions;
export const logger = pinoLogger;
