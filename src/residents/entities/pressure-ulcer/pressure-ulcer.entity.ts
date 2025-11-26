import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Resident } from '../resident.entity';

@Entity('pressure_ulcers')
export class PressureUlcer {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Resident)
  @JoinColumn({ name: 'resident_id' })
  resident: Resident;

  @Column()
  resident_id: number;

  @Column({ nullable: true })
  has_ulcer: 'Có' | 'Không';

  @Column({ nullable: true })
  stage: number; // 1-4

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  recorded_at: Date;
}
