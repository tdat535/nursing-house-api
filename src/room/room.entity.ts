import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Bed } from './bed.entity';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['standard', 'vip', 'special_care'] })
  type: string;

  @Column()
  maxBeds: number;

  @OneToMany(() => Bed, bed => bed.room, { cascade: true })
  beds: Bed[];
}
