import { PartialType } from '@nestjs/mapped-types';
import { CreateResidentWithMedicalDto } from './CreateResidentWithMedicalDto';

export class UpdateResidentDto extends PartialType(CreateResidentWithMedicalDto) {}
