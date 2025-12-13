// src/health-check/entities/health-check.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Resident } from '../residents/entities/resident.entity';

@Entity()
export class HealthCheck {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Resident, resident => resident.healthChecks, { eager: true })
  resident: Resident;

  @Column({ type: 'float', nullable: true })
  temperature: number;

  @Column({ type: 'int', nullable: true })
  heartRate: number;

  @Column({ type: 'int', nullable: true })
  bloodPressureSystolic: number;

  @Column({ type: 'int', nullable: true })
  bloodPressureDiastolic: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Mở rộng các thông số khác
  @Column({ type: 'boolean', nullable: true })
  eatingWell: boolean; // ăn uống đầy đủ

  @Column({ type: 'boolean', nullable: true })
  drankWater: boolean; // uống nước đủ

  @Column({ type: 'boolean', nullable: true })
  moodGood: boolean; // tâm trạng tốt

  @Column({ type: 'boolean', nullable: true })
  medicationTaken: boolean; // đã uống thuốc

  @Column({ type: 'text', nullable: true })
  mobility: string; // di chuyển, tập thể dục

  @CreateDateColumn()
  createdAt: Date;
}
