import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, ManyToMany, JoinTable } from 'typeorm';
import { Guardian } from './guardian/guardian.entity';
import { Bed } from '../../room/bed.entity';
import { Service } from '../../Service/service.entity';
import { HealthCheck } from 'src/HealthCheck/health-check.entity';
import { Medication } from './medications/medication.entity';

@Entity('residents')
export class Resident {
  @PrimaryGeneratedColumn()
  resident_id: number;

  @Column()
  full_name: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'other' })
  gender: string;

  @Column({ nullable: true })
  national_id: string;

  @OneToMany(() => Guardian, guardian => guardian.resident, { cascade: true })
  guardians: Guardian[];

  @OneToOne(() => Bed, bed => bed.resident, { nullable: true })
  bed: Bed | null;

  @ManyToMany(() => Service, (service) => service.residents, { cascade: true })
  @JoinTable({
    name: 'resident_services',
    joinColumn: { name: 'resident_id', referencedColumnName: 'resident_id' },
    inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' },
  })
  services: Service[];

  @OneToMany(() => HealthCheck, healthCheck => healthCheck.resident)
  healthChecks: HealthCheck[];

  @Column({ type: 'enum', enum: ['active', 'out'], default: 'active' })
  status: 'active' | 'out';

  @OneToMany(() => Medication, med => med.resident, { cascade: true })
  medications: Medication[];
}
