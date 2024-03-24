import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DealsModule } from './deals/deals.module';
import { loggerOptions } from './logger';
import { config } from './config';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';
import { connectDB } from './database';
import { Connection } from 'mongoose';
import { providers } from './constants';

@Module({
  imports: [
    DealsModule,
    LoggerModule.forRoot({
      pinoHttp:
        config.env === 'development'
          ? {
              serializers: {
                req: ({ id, method, url, params, query }) => {
                  return {
                    id,
                    method,
                    url,
                    params,
                    query,
                  };
                },
                res: ({ statusCode }) => {
                  return { statusCode };
                },
              },
              transport: { target: 'pino-pretty' },
              stream: pino.destination({
                dest: config.logsDestination,
                colorize: true,
                sync: false,
              }),
              redact: {
                paths: ['req.headers.authorization', 'req.headers.cookie'],
                censor: '**REDACTED**',
              },
            }
          : loggerOptions,
      forRoutes: ['*'],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: providers.DatabaseConnection,
      useFactory: async (): Promise<Connection> =>
        await connectDB(config.databaseUrl),
    },
  ],
})
export class AppModule {}
