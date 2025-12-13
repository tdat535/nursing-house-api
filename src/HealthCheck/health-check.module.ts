// src/health-check/health-check.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthCheck } from './health-check.entity';
import { HealthCheckService } from './health-check.service';
import { HealthCheckController } from './health-check.controller';
import { Resident } from '../residents/entities/resident.entity';
import { VitalsController } from './vital.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HealthCheck, Resident])],
  providers: [HealthCheckService],
  controllers: [HealthCheckController, VitalsController],
  exports: [HealthCheckService],
})
export class HealthCheckModule {}
