import { IsString, IsOptional, IsDateString, IsEnum, ValidateNested, IsArray, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

// --- Medical Conditions ---
class MedicalConditionDto {
  @IsString()
  condition_name: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

// --- Medications ---
class MedicationDto {
  @IsString()
  medication_name: string;

  @IsString()
  @IsOptional()
  dose?: string;

  @IsString()
  @IsOptional()
  frequency?: string;

  @IsString()
  @IsOptional()
  allergy?: string;
}

// --- ADL Status ---
class ADLStatusDto {
  @IsString()
  @IsOptional()
  mobility?: string;

  @IsString()
  @IsOptional()
  feeding?: string;

  @IsString()
  @IsOptional()
  bathing?: string;

  @IsString()
  @IsOptional()
  dressing?: string;

  @IsString()
  @IsOptional()
  hearing_speaking?: string;

  @IsString()
  @IsOptional()
  cognition?: string;
}

// --- Initial Assessments ---
class InitialAssessmentDto {
  @IsNumber()
  @IsOptional()
  height_cm?: number;

  @IsNumber()
  @IsOptional()
  weight_kg?: number;

  @IsString()
  @IsOptional()
  nutrition_status?: string; // Tốt / Trung bình / Kém

  @IsString()
  @IsOptional()
  malnutrition_risk?: string; // Có / Không

  @IsString()
  @IsOptional()
  exam_notes?: string; // Thăm khám bác sĩ tổng quan
}

// --- Interventions / Surgery ---
class InterventionDto {
  @IsString()
  description: string; // Phẫu thuật, can thiệp

  @IsDateString()
  @IsOptional()
  date_performed?: string;

  @IsString()
  @IsOptional()
  device_in_place?: string; // stent, khớp nhân tạo, máy trợ thở, sonde…
}

// --- Pressure Ulcers ---
class PressureUlcerDto {
  @IsString()
  @IsOptional()
  has_ulcer?: 'Có' | 'Không';

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(4)
  stage?: number; // Mức độ 1-4

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

class GuardianDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  relationship: string;
}

// --- Main DTO ---
export class CreateResidentWithMedicalDto {
  @IsString()
  full_name: string;

  @IsDateString()
  @IsOptional()
  dob?: string;

  @IsEnum(['male', 'female', 'other'])
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  national_id?: string;

  @IsNumber()
  @IsOptional()
  bedId?: number;

  @IsNumber()
  @IsOptional()
  roomId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuardianDto)
  @IsOptional()
  guardians?: GuardianDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicalConditionDto)
  @IsOptional()
  medical_conditions?: MedicalConditionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  @IsOptional()
  medications?: MedicationDto[];

  @ValidateNested()
  @Type(() => ADLStatusDto)
  @IsOptional()
  adl_status?: ADLStatusDto;

  @ValidateNested()
  @Type(() => InitialAssessmentDto)
  @IsOptional()
  initial_assessment?: InitialAssessmentDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterventionDto)
  @IsOptional()
  interventions?: InterventionDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PressureUlcerDto)
  @IsOptional()
  pressure_ulcers?: PressureUlcerDto[];
}
