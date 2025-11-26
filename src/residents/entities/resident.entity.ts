import { Entity, PrimaryGeneratedColumn, Column, OneToMany  } from 'typeorm';
import { Guardian } from './guardian/guardian.entity';

@Entity('residents')
export class Resident {
  @PrimaryGeneratedColumn()
  resident_id: number;

  @Column()
  full_name: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'enum', enum: ['male','female','other'], default: 'other' })
  gender: string;

  @Column({ nullable: true })
  national_id: string;

  @Column({ nullable: true })
  room: string;

  @Column({ nullable: true })
  bed: string;

  @OneToMany(() => Guardian, guardian => guardian.resident, { cascade: true })
  guardians: Guardian[];

}
