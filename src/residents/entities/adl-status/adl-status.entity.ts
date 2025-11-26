import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Resident } from '../resident.entity';

@Entity('adl_status')
export class ADLStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Resident)
  @JoinColumn({ name: 'resident_id' })
  resident: Resident;

  @Column()
  resident_id: number;

  @Column({ nullable: true })
  mobility: string;

  @Column({ nullable: true })
  feeding: string;

  @Column({ nullable: true })
  bathing: string;

  @Column({ nullable: true })
  dressing: string;

  @Column({ nullable: true })
  hearing_speaking: string;

  @Column({ nullable: true })
  cognition: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assessed_at: Date;
}
