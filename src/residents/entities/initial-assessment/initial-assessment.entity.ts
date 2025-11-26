import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Resident } from '../resident.entity';

@Entity('initial_assessments')
export class InitialAssessment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Resident)
  @JoinColumn({ name: 'resident_id' })
  resident: Resident;

  @Column()
  resident_id: number;

  @Column({ nullable: true })
  height_cm: number;

  @Column({ nullable: true })
  weight_kg: number;

  @Column({ nullable: true })
  nutrition_status: string; // tốt / trung bình / kém

  @Column({ nullable: true })
  malnutrition_risk: string; // có / không

  @Column({ nullable: true })
  exam_notes: string; // thăm khám bác sĩ tổng quan

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assessed_at: Date;
}
