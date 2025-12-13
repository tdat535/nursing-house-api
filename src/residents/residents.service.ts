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
import { Bed } from '../room/bed.entity';
import { Service } from '../Service/service.entity';
import { BadRequestException } from '@nestjs/common';
import { OutResidentDto } from './dto/out-resident.dto';

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
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Bed)
    private readonly bedRepository: Repository<Bed>,
  ) { }

  // --- CRUD cơ bản ---
  findAll(): Promise<Resident[]> {
    return this.residentsRepository.find({
      relations: ["bed", "bed.room"], // join cả giường và phòng
    });
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
    console.log('DTO received:', dto);
    return this.dataSource.transaction(async manager => {
      try {
        const bed = await manager.getRepository(Bed).findOne({
          where: { id: dto.bedId },
          relations: ['resident'],
        });
        console.log('Found bed:', bed);
        if (!bed) throw new NotFoundException("Bed not found");
        if (bed.resident) throw new BadRequestException("Bed is already occupied");

        // 2. Tạo Resident
        const resident = manager.create(Resident, {
          full_name: dto.full_name,
          dob: dto.dob,
          gender: dto.gender,
          national_id: dto.national_id,
          bed: bed,
        });

        await manager.save(resident);

        // 2b. Guardian
        if (dto.guardians?.length) {
          const g = dto.guardians.map(x => ({ resident, ...x }));
          await manager.getRepository(Guardian).save(g);
        }

        // 3. Medical
        if (dto.medical_conditions?.length) {
          const mc = dto.medical_conditions.map(c => ({ resident_id: resident.resident_id, ...c }));
          await manager.getRepository(MedicalCondition).save(mc);
        }

        if (dto.medications?.length) {
          await manager.getRepository(Medication).save(
            dto.medications.map(m => ({ resident_id: resident.resident_id, ...m }))
          );
        }

        if (dto.adl_status) {
          await manager.getRepository(ADLStatus).save({
            resident_id: resident.resident_id,
            ...dto.adl_status,
          });
        }

        if (dto.initial_assessment) {
          await manager.getRepository(InitialAssessment).save({
            resident_id: resident.resident_id,
            ...dto.initial_assessment,
          });
        }

        if (dto.interventions?.length) {
          await manager.getRepository(Intervention).save(
            dto.interventions.map(i => ({ resident_id: resident.resident_id, ...i }))
          );
        }

        if (dto.pressure_ulcers?.length) {
          await manager.getRepository(PressureUlcer).save(
            dto.pressure_ulcers.map(u => ({ resident_id: resident.resident_id, ...u }))
          );
        }

        return resident;
      } catch (err) {
        console.error('Error in createWithMedical:', err);
        throw err;
      }
    });
  }

  async addServices(residentId: number, serviceIds: number[]) {
    const resident = await this.residentsRepository.findOne({
      where: { resident_id: residentId },
      relations: ['services'], // phải có relation services trong entity Resident
    });
    if (!resident) throw new Error('Resident not found');

    if (!serviceIds || !serviceIds.length) return resident;

    // Lấy danh sách dịch vụ có id tương ứng
    const services = await this.serviceRepository.findBy({
      id: serviceIds as any, // TypeORM >=0.3 findBy chấp nhận array
    });

    // Ghép các dịch vụ mới, tránh trùng
    const existingIds = new Set(resident.services?.map(s => s.id) || []);
    const newServices = services.filter(s => !existingIds.has(s.id));

    resident.services = [...(resident.services || []), ...newServices];

    return this.residentsRepository.save(resident);
  }

  async getAllResidentServices() {
    try {
      const data = await this.residentsRepository
        .createQueryBuilder('resident')
        .leftJoinAndSelect('resident.services', 'service')
        .select([
          'resident.resident_id',
          'service.id',
          'service.name',
          'service.description',
          'service.price',
        ])
        .getMany();

      const result = data.flatMap(resident =>
        (resident.services || []).map(service => ({
          id: service.id,
          residentId: resident.resident_id,
          name: service.name,
          description: service.description,
          price: Number(service.price) || 0,
        }))
      );

      return result;
    } catch (error) {
      console.error('Error in getAllResidentServices:', error);
      throw new Error(`Failed to get resident services: ${error.message}`);
    }
  }

  async outResident(dto: OutResidentDto) {
    return this.dataSource.transaction(async manager => {
      const resident = await manager.findOne(Resident, {
        where: { resident_id: dto.residentId },
        relations: ['bed'],
      });

      if (!resident) throw new NotFoundException('Resident not found');

      resident.status = 'out';

      if (resident.bed) {
        // Giải phóng giường bằng query builder, tránh OneToOne problem
        await manager.createQueryBuilder()
          .update(Bed)
          .set({ resident: null })
          .where('id = :id', { id: resident.bed.id })
          .execute();

        resident.bed = null;
      }

      return manager.save(resident);
    });
  }


}
