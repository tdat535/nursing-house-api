import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Resident } from '../resident.entity';

@Entity('medications')
export class Medication {
  @PrimaryGeneratedColumn()
  medication_id: number;

  @ManyToOne(() => Resident, resident => resident.medications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resident_id' })
  resident: Resident;

  @Column()
  medication_name: string;

  @Column({ nullable: true })
  dose: string;

  @Column({ nullable: true })
  frequency: string;

  @Column({ nullable: true })
  allergy: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

}
