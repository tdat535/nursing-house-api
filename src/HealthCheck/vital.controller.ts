// src/health-check/health-check.controller.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { CreateVitalDto } from './create-vital.dto';

@Controller('vitals')
export class VitalsController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Post()
  async create(@Body() dto: CreateVitalDto) {
    return this.healthCheckService.createVital(dto);
  }

  @Get()
  async findAll(@Query('residentId') residentId?: string) {
    const id = residentId ? Number(residentId) : undefined;
    return this.healthCheckService.getVitals(id);
  }
}