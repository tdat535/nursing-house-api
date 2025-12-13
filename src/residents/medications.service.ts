import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './entities/medications/medication.entity';
import { Resident } from './entities/resident.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepo: Repository<Medication>,
    @InjectRepository(Resident)
    private readonly residentRepo: Repository<Resident>,
  ) {}

  async create(dto: CreateMedicationDto): Promise<Medication> {
    const resident = await this.residentRepo.findOneBy({ resident_id: dto.residentId });
    if (!resident) throw new NotFoundException('Resident not found');

    const medication = this.medicationRepo.create({
      resident,
      medication_name: dto.medication_name,
      dose: dto.dose,
      frequency: dto.frequency,
      allergy: dto.allergy,
    });

    return this.medicationRepo.save(medication);
  }

  async findAll(): Promise<Medication[]> {
    return this.medicationRepo.find({ relations: ['resident'] });
  }

  async findByResident(residentId: number): Promise<Medication[]> {
    return this.medicationRepo.find({
      where: { resident: { resident_id: residentId } },
      relations: ['resident'],
    });
  }

  async findOne(id: number): Promise<Medication> {
    const medication = await this.medicationRepo.findOne({
      where: { medication_id: id },
      relations: ['resident'],
    });
    if (!medication) throw new NotFoundException('Medication not found');
    return medication;
  }

  async update(id: number, dto: UpdateMedicationDto): Promise<Medication> {
    const medication = await this.findOne(id);
    Object.assign(medication, dto);
    return this.medicationRepo.save(medication);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const medication = await this.findOne(id);
    await this.medicationRepo.remove(medication);
    return { deleted: true };
  }
}
