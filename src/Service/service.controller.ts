// src/services/service.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ServiceService } from './service.service';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() body: { name: string; price: number; description?: string }) {
    const { name, price, description } = body;
    return this.serviceService.createService(name, price, description);
  }

  @Get()
  getAll() {
    return this.serviceService.getAllServices();
  }
}
