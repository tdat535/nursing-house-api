import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Resident } from '../resident.entity';

@Entity('interventions')
export class Intervention {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Resident)
  @JoinColumn({ name: 'resident_id' })
  resident: Resident;

  @Column()
  resident_id: number;

  @Column()
  description: string; // phẫu thuật, can thiệp

  @Column({ nullable: true })
  date_performed: Date;

  @Column({ nullable: true })
  device_in_place: string; // stent, khớp nhân tạo, máy trợ thở…
}
