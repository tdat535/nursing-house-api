// guardian.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Resident } from '../resident.entity';

@Entity('guardians')
export class Guardian {
  @PrimaryGeneratedColumn()
  guardian_id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @ManyToOne(() => Resident, resident => resident.guardians)
  @JoinColumn({ name: 'resident_id' })
  resident: Resident;

  @Column()
  resident_id: number;

  @Column()
  relationship: string;
}
