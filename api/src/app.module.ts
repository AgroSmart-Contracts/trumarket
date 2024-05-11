import { Inject, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Connection } from 'mongoose';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { config } from './config';
import { providers } from './constants';
import { connectDB } from './database';
import { DealsModule } from './deals/deals.module';
import { loggerOptions } from './logger';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp:
        config.env === 'development' || config.prettyLogs
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
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: '1h' },
      global: true,
    }),
    AuthModule,
    UsersModule,
    DealsModule,
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
export class AppModule {
  constructor(@Inject(providers.DatabaseConnection) private dbClient) {}

  async onModuleDestroy() {
    await this.dbClient.close();
  }
}
