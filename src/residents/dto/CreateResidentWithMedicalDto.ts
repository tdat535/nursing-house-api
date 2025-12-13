import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  ValidateNested,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// --- Medical Conditions ---
class MedicalConditionDto {
  @ApiProperty({ example: 'Tiểu đường' })
  @IsString()
  condition_name: string;

  @ApiPropertyOptional({ example: 'Đã mắc 10 năm' })
  @IsString()
  @IsOptional()
  notes?: string;
}

// --- Medications ---
class MedicationDto {
  @ApiProperty({ example: 'Metformin' })
  @IsString()
  medication_name: string;

  @ApiPropertyOptional({ example: '500mg' })
  @IsString()
  @IsOptional()
  dose?: string;

  @ApiPropertyOptional({ example: '2 lần/ngày' })
  @IsString()
  @IsOptional()
  frequency?: string;

  @ApiPropertyOptional({ example: 'Không' })
  @IsString()
  @IsOptional()
  allergy?: string;
}

// --- ADL Status ---
class ADLStatusDto {
  @ApiPropertyOptional({ example: 'Đi lại có hỗ trợ' })
  @IsString()
  @IsOptional()
  mobility?: string;

  @ApiPropertyOptional({ example: 'Cần trợ giúp' })
  @IsString()
  @IsOptional()
  feeding?: string;

  @ApiPropertyOptional({ example: 'Cần trợ giúp' })
  @IsString()
  @IsOptional()
  bathing?: string;

  @ApiPropertyOptional({ example: 'Tự lập' })
  @IsString()
  @IsOptional()
  dressing?: string;

  @ApiPropertyOptional({ example: 'Nghe nói kém' })
  @IsString()
  @IsOptional()
  hearing_speaking?: string;

  @ApiPropertyOptional({ example: 'Giảm trí nhớ nhẹ' })
  @IsString()
  @IsOptional()
  cognition?: string;
}

// --- Initial Assessments ---
class InitialAssessmentDto {
  @ApiPropertyOptional({ example: 165 })
  @IsNumber()
  @IsOptional()
  height_cm?: number;

  @ApiPropertyOptional({ example: 55 })
  @IsNumber()
  @IsOptional()
  weight_kg?: number;

  @ApiPropertyOptional({ example: 'Trung bình' })
  @IsString()
  @IsOptional()
  nutrition_status?: string;

  @ApiPropertyOptional({ example: 'Không' })
  @IsString()
  @IsOptional()
  malnutrition_risk?: string;

  @ApiPropertyOptional({ example: 'Huyết áp ổn định' })
  @IsString()
  @IsOptional()
  exam_notes?: string;
}

// --- Interventions / Surgery ---
class InterventionDto {
  @ApiProperty({ example: 'Phẫu thuật thay khớp háng' })
  @IsString()
  description: string;

  @ApiPropertyOptional({ example: '2024-06-10' })
  @IsDateString()
  @IsOptional()
  date_performed?: string;

  @ApiPropertyOptional({ example: 'Khớp nhân tạo' })
  @IsString()
  @IsOptional()
  device_in_place?: string;
}

// --- Pressure Ulcers ---
class PressureUlcerDto {
  @ApiPropertyOptional({ example: 'Không', enum: ['Có', 'Không'] })
  @IsString()
  @IsOptional()
  has_ulcer?: 'Có' | 'Không';

  @ApiPropertyOptional({ example: 2, minimum: 1, maximum: 4 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(4)
  stage?: number;

  @ApiPropertyOptional({ example: 'Gót chân trái' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ example: 'Đang theo dõi' })
  @IsString()
  @IsOptional()
  notes?: string;
}

// --- Guardian ---
class GuardianDto {
  @ApiProperty({ example: 'Nguyễn Văn B' })
  @IsString()
  name: string;

  @ApiProperty({ example: '0909123456' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Con trai' })
  @IsString()
  relationship: string;
}

// --- Main DTO ---
export class CreateResidentWithMedicalDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  full_name: string;

  @ApiPropertyOptional({ example: '1945-05-12' })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiPropertyOptional({
    example: 'male',
    enum: ['male', 'female', 'other'],
  })
  @IsEnum(['male', 'female', 'other'])
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsString()
  @IsOptional()
  national_id?: string;

  @ApiPropertyOptional({ example: 12 })
  @IsNumber()
  @IsOptional()
  bedId?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsNumber()
  @IsOptional()
  roomId?: number;

  @ApiPropertyOptional({ type: [GuardianDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuardianDto)
  @IsOptional()
  guardians?: GuardianDto[];

  @ApiPropertyOptional({ type: [MedicalConditionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicalConditionDto)
  @IsOptional()
  medical_conditions?: MedicalConditionDto[];

  @ApiPropertyOptional({ type: [MedicationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  @IsOptional()
  medications?: MedicationDto[];

  @ApiPropertyOptional({ type: ADLStatusDto })
  @ValidateNested()
  @Type(() => ADLStatusDto)
  @IsOptional()
  adl_status?: ADLStatusDto;

  @ApiPropertyOptional({ type: InitialAssessmentDto })
  @ValidateNested()
  @Type(() => InitialAssessmentDto)
  @IsOptional()
  initial_assessment?: InitialAssessmentDto;

  @ApiPropertyOptional({ type: [InterventionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterventionDto)
  @IsOptional()
  interventions?: InterventionDto[];

  @ApiPropertyOptional({ type: [PressureUlcerDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PressureUlcerDto)
  @IsOptional()
  pressure_ulcers?: PressureUlcerDto[];
}
