import { ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { config } from './config';
import { Expose } from 'class-transformer';

export enum ServiceStatus {
  UP = 'UP',
  DOWN = 'DOWN',
}

class ServicesStatus {
  @ApiProperty({enum:ServiceStatus})
  @Expose()
  database: ServiceStatus
}

export class AppInfo {
  constructor(appInfo:AppInfo){
    Object.assign(this,appInfo)
  }

  @ApiProperty({enum:ServiceStatus})
  @Expose()
  status: ServiceStatus

  @ApiProperty({
    type: ServicesStatus
})
  @Expose()
  services: {
    database: ServiceStatus
  }
}

@Controller()
export class AppController {
  constructor() {}

  @Get('/health')
  @ApiOperation({summary:"Get application status"})
  @ApiResponse({ status: 200, type:AppInfo, description: 'Returns application status' })
  health(): AppInfo {
    return new AppInfo({
      status: ServiceStatus.UP,
      services: {
        database:ServiceStatus.UP
      }
    })
  }

  @Get()
  @ApiOperation({summary:"Get application version"})
  @ApiResponse({ status: 200, description: 'Returns application version' })
  getVersion(): string {
    return config.version;
  }
}
