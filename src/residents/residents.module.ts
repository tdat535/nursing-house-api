import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidentsService } from './residents.service';
import { ResidentsController } from './residents.controller';
import { Resident } from './entities/resident.entity';
import { ADLStatus } from './entities/adl-status/adl-status.entity';
import { MedicalCondition } from './entities/medical-conditions/medical-condition.entity';
import { Medication } from './entities/medications/medication.entity';
import { InitialAssessment } from './entities/initial-assessment/initial-assessment.entity';
import { Intervention } from './entities/intervention/intervention.entity';
import { PressureUlcer } from './entities/pressure-ulcer/pressure-ulcer.entity';
import { Service } from '../Service/service.entity';
import { Bed } from 'src/room/bed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Resident,
      ADLStatus,
      MedicalCondition,
      Medication,
      InitialAssessment,
      Intervention,
      PressureUlcer,
      Service,
      Bed
    ]),
  ],
  controllers: [ResidentsController],
  providers: [ResidentsService],
})
export class ResidentsModule {}
