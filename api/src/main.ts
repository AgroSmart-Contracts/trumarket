import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as schedule from 'node-schedule';

import { AppModule } from './app.module';
import { ErrorsFilter } from './errors.filter';
import { syncDealsLogs } from './jobs/syncDealsLogs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('TruMarket Shipment API')
    .setVersion('1.1')
    .addTag('TruMarket')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  app.useLogger(app.get(Logger));

  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ErrorsFilter(httpAdapter));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
        exposeUnsetFields: false,
        excludeExtraneousValues: true,
      },
    }),
  );

  const reflector = app.get(Reflector);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      excludeExtraneousValues: true,
    }),
  );

  schedule.scheduleJob('* * * * *', syncDealsLogs);

  await app.listen(3000);
}
bootstrap();
