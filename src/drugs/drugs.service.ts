import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Drug } from './drug.entity';
import { CreateDrugDto } from './dto/create-drug.dto';
import { UpdateDrugDto } from './dto/update-drug.dto';

@Injectable()
export class DrugsService {
  constructor(
    @InjectRepository(Drug)
    private readonly drugRepo: Repository<Drug>,
  ) {}

  async create(dto: CreateDrugDto): Promise<Drug> {
    const drug = this.drugRepo.create(dto);
    return this.drugRepo.save(drug);
  }

  findAll(): Promise<Drug[]> {
    return this.drugRepo.find();
  }

  async findOne(id: number): Promise<Drug> {
    const drug = await this.drugRepo.findOneBy({ id });
    if (!drug) throw new NotFoundException('Drug not found');
    return drug;
  }

  async update(id: number, dto: UpdateDrugDto): Promise<Drug> {
    const drug = await this.findOne(id);
    Object.assign(drug, dto);
    return this.drugRepo.save(drug);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const drug = await this.findOne(id);
    await this.drugRepo.remove(drug);
    return { deleted: true };
  }
}
