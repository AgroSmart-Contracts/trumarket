import { ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { Controller, Get, Inject } from '@nestjs/common';
import { config } from './config';
import { Expose } from 'class-transformer';
import { providers } from './constants';
import mongoose from 'mongoose';

export enum ServiceStatus {
  UP = 'UP',
  DOWN = 'DOWN',
}

class ServicesStatus {
  @ApiProperty({ enum: ServiceStatus })
  @Expose()
  database: ServiceStatus;
}

export class AppInfo {
  constructor(appInfo: AppInfo) {
    Object.assign(this, appInfo);
  }

  @ApiProperty({ enum: ServiceStatus })
  @Expose()
  status: ServiceStatus;

  @ApiProperty({
    type: ServicesStatus,
  })
  @Expose()
  services: {
    database: ServiceStatus;
  };
}

@Controller()
export class AppController {
  constructor(
    @Inject(providers.DatabaseConnection)
    private readonly db: mongoose.Connection,
  ) {}

  @Get('/health')
  @ApiOperation({ summary: 'Get application status' })
  @ApiResponse({
    status: 200,
    type: AppInfo,
    description: 'Returns application status',
  })
  health(): AppInfo {
    return new AppInfo({
      status: ServiceStatus.UP,
      services: {
        database:
          this.db.readyState == 1 ? ServiceStatus.UP : ServiceStatus.DOWN,
      },
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get application version' })
  @ApiResponse({ status: 200, description: 'Returns application version' })
  getVersion(): string {
    return config.version;
  }
}
