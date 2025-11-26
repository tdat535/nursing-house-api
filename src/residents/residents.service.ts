import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Resident } from './entities/resident.entity';
import { CreateResidentWithMedicalDto } from './dto/CreateResidentWithMedicalDto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { MedicalCondition } from './entities/medical-conditions/medical-condition.entity';
import { Medication } from './entities/medications/medication.entity';
import { ADLStatus } from './entities/adl-status/adl-status.entity';
import { InitialAssessment } from './entities/initial-assessment/initial-assessment.entity';
import { Intervention } from './entities/intervention/intervention.entity';
import { PressureUlcer } from './entities/pressure-ulcer/pressure-ulcer.entity';
import { Guardian } from './entities/guardian/guardian.entity';

@Injectable()
export class ResidentsService {
  constructor(
    @InjectRepository(Resident)
    private residentsRepository: Repository<Resident>,
    private dataSource: DataSource,
    @InjectRepository(MedicalCondition)
    private medicalRepo: Repository<MedicalCondition>,
    @InjectRepository(Medication)
    private medicationRepo: Repository<Medication>,
    @InjectRepository(ADLStatus)
    private adlRepo: Repository<ADLStatus>,
    @InjectRepository(InitialAssessment)
    private initialRepo: Repository<InitialAssessment>,
    @InjectRepository(Intervention)
    private interventionRepo: Repository<Intervention>,
    @InjectRepository(PressureUlcer)
    private pressureUlcerRepo: Repository<PressureUlcer>,
  ) { }

  // --- CRUD cơ bản ---
  findAll(): Promise<Resident[]> {
    return this.residentsRepository.find();
  }

  async findOne(id: number): Promise<Resident> {
    const resident = await this.residentsRepository.findOneBy({ resident_id: id });
    if (!resident) {
      throw new NotFoundException(`Resident with id ${id} not found`);
    }
    return resident;
  }

  async update(id: number, updateDto: UpdateResidentDto): Promise<Resident> {
    const resident = await this.residentsRepository.preload({
      resident_id: id,
      ...updateDto,
    });
    if (!resident) throw new NotFoundException(`Resident with id ${id} not found`);
    return this.residentsRepository.save(resident);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const resident = await this.findOne(id);
    await this.residentsRepository.remove(resident);
    return { deleted: true };
  }

  // --- Tạo resident + hồ sơ y tế full ---
  async createWithMedical(dto: CreateResidentWithMedicalDto) {
    return this.dataSource.transaction(async manager => {
      // 1. Resident
      const resident = manager.create(Resident, {
        full_name: dto.full_name,
        dob: dto.dob,
        gender: dto.gender,
        national_id: dto.national_id,
        room: dto.room,
        bed: dto.bed,
      });
      await manager.save(resident);

      // 1b. Tạo guardians
      if (dto.guardians?.length) {
        const guardians = dto.guardians.map(g => ({
          resident_id: resident.resident_id,
          ...g, // g = { name, phone }
        }));
        await manager.getRepository(Guardian).save(guardians);
      } 

      // 2. Medical Conditions
      if (dto.medical_conditions?.length) {
        const mc = dto.medical_conditions.map(c => ({ resident_id: resident.resident_id, ...c }));
        await manager.getRepository(MedicalCondition).save(mc);
      }

      // 3. Medications
      if (dto.medications?.length) {
        const meds = dto.medications.map(m => ({ resident_id: resident.resident_id, ...m }));
        await manager.getRepository(Medication).save(meds);
      }

      // 4. ADL
      if (dto.adl_status) {
        await manager.getRepository(ADLStatus).save({ resident_id: resident.resident_id, ...dto.adl_status });
      }

      // 5. Initial Assessment
      if (dto.initial_assessment) {
        await manager.getRepository(InitialAssessment).save({
          resident_id: resident.resident_id,
          ...dto.initial_assessment,
        });
      }

      // 6. Interventions
      if (dto.interventions?.length) {
        const interventions = dto.interventions.map(i => ({ resident_id: resident.resident_id, ...i }));
        await manager.getRepository(Intervention).save(interventions);
      }

      // 7. Pressure Ulcers
      if (dto.pressure_ulcers?.length) {
        const ulcers = dto.pressure_ulcers.map(u => ({ resident_id: resident.resident_id, ...u }));
        await manager.getRepository(PressureUlcer).save(ulcers);
      }

      return resident;
    });
  }
}
