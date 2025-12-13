export class CreateHealthCheckDto {
  residentId: number;
  temperature?: number;
  heartRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  eatingWell?: boolean;
  drankWater?: boolean;
  moodGood?: boolean;
  medicationTaken?: boolean;
  mobility?: string;
  notes?: string;
}
