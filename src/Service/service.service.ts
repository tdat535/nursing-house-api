// src/services/service.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './service.entity';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  // Tạo dịch vụ mới
  async createService(name: string, price: number, description?: string) {
    const service = this.serviceRepository.create({ name, price, description });
    return this.serviceRepository.save(service);
  }

  // Lấy danh sách tất cả dịch vụ
  async getAllServices() {
    return this.serviceRepository.find();
  }

  // Lấy dịch vụ theo id list
  async getServicesByIds(ids: number[]) {
    return this.serviceRepository.findByIds(ids);
  }
}
