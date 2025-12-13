// src/health-check/health-check.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthCheck } from './health-check.entity';
import { CreateHealthCheckDto } from './create-health-check.dto';
import { Resident } from '../residents/entities/resident.entity';
import { CreateVitalDto } from './create-vital.dto';

@Injectable()
export class HealthCheckService {
  constructor(
    @InjectRepository(HealthCheck)
    private readonly healthCheckRepository: Repository<HealthCheck>,
    @InjectRepository(Resident)
    private readonly residentsRepository: Repository<Resident>,
  ) {}

  async create(dto: CreateHealthCheckDto) {
    const resident = await this.residentsRepository.findOneBy({ resident_id: dto.residentId });

    if (!resident) throw new Error('Resident not found');

    const check = this.healthCheckRepository.create({
      resident,
      temperature: dto.temperature,
      heartRate: dto.heartRate,
      bloodPressureSystolic: dto.bloodPressureSystolic,
      bloodPressureDiastolic: dto.bloodPressureDiastolic,
      notes: dto.notes,
    });

    return this.healthCheckRepository.save(check);
  }

  findAll() {
    return this.healthCheckRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['resident'],
    });
  }

  findByResident(residentId: number) {
    return this.healthCheckRepository.find({
      where: { resident: { resident_id: residentId } },
      order: { createdAt: 'DESC' },
    });
  }

   async createVital(dto: CreateVitalDto) {
    const resident = await this.residentsRepository.findOneBy({ resident_id: dto.residentId });
    if (!resident) throw new Error('Resident not found');

    const check = this.healthCheckRepository.create({
      resident,
      temperature: dto.temperature,
      heartRate: dto.heartRate,
      bloodPressureSystolic: dto.bloodPressureSystolic,
      bloodPressureDiastolic: dto.bloodPressureDiastolic,
      notes: dto.notes,
    });

    return this.healthCheckRepository.save(check);
  }

  // Lấy tất cả vitals (có thể filter theo residentId nếu cần)
  async getVitals(residentId?: number) {
    const where = residentId ? { resident: { resident_id: residentId } } : {};
    return this.healthCheckRepository.find({
      where,
      order: { createdAt: 'DESC' },
      relations: ['resident'],
    });
  }
}
