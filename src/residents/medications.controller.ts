import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  create(@Body() dto: CreateMedicationDto) {
    return this.medicationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.medicationsService.findAll();
  }

  @Get('resident/:residentId')
  findByResident(@Param('residentId') residentId: string) {
    return this.medicationsService.findByResident(Number(residentId));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicationsService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMedicationDto) {
    return this.medicationsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicationsService.remove(Number(id));
  }
}
