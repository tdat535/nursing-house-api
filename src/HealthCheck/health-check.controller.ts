// src/health-check/health-check.controller.ts
import { Controller, Get, Post, Body, Param, Query, Res } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';
import { CreateHealthCheckDto } from './create-health-check.dto';
import { CreateVitalDto } from './create-vital.dto';
import type { Response } from 'express';
import * as XLSX from 'xlsx';

@Controller('health-check')
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  findAll() {
    return this.healthCheckService.findAll();
  }

  @Get('resident/:id')
  findByResident(@Param('id') id: string) {
    return this.healthCheckService.findByResident(Number(id));
  }

  @Post()
  create(@Body() dto: CreateHealthCheckDto) {
    return this.healthCheckService.create(dto);
  }

  @Get('export')
  async exportExcel(@Res() res: Response) {
    const data = await this.healthCheckService.findAll();

    const wsData = data.map(item => ({
      'Cư dân': item.resident.full_name,
      'Ngày': item.createdAt.toISOString(),
      'Nhiệt độ (°C)': item.temperature,
      'Nhịp tim': item.heartRate,
      'Huyết áp': item.bloodPressureSystolic && item.bloodPressureDiastolic
        ? `${item.bloodPressureSystolic}/${item.bloodPressureDiastolic}`
        : '',
      'Ăn uống đầy đủ': item.eatingWell ? 'Có' : 'Không',
      'Uống nước đủ': item.drankWater ? 'Có' : 'Không',
      'Tâm trạng tốt': item.moodGood ? 'Có' : 'Không',
      'Đã uống thuốc': item.medicationTaken ? 'Có' : 'Không',
      'Di chuyển / Hoạt động': item.mobility,
      'Ghi chú': item.notes,
    }));

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HealthReport');

    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="health-report.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
  }
}


