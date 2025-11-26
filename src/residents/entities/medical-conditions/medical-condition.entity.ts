import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Resident } from '../resident.entity';

@Entity('medical_conditions')
export class MedicalCondition {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Resident)
  @JoinColumn({ name: 'resident_id' })
  resident: Resident;

  @Column()
  resident_id: number;

  @Column()
  condition_name: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  diagnosed_at: Date;
}
