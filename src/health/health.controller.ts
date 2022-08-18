import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
@ApiExcludeController()
export class HealthController {
  constructor(
    private healthCheckService: HealthCheckService,
    private http: HttpHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @HttpCode(HttpStatus.OK)
  checkHealth() {
    return this.healthCheckService.check([
      () => this.http.pingCheck('Basic Check', 'http://localhost:5000/api'),
      () =>
        this.microservice.pingCheck<RedisOptions>('redis', {
          transport: Transport.REDIS,
          options: {
            host: process.env.REDIS_HOST,
            port: +process.env.REDIS_PORT,
          },
        }),
    ]);
  }
}
