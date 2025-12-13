export class CreateMedicationDto {
  residentId: number;
  medication_name: string;
  dose?: string;
  frequency?: string;
  allergy?: string;
}
