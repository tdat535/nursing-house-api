// src/services/service.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Resident } from '../residents/entities/resident.entity';
import { Exclude } from 'class-transformer';

@Entity('services')
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    price: number;

    @ManyToMany(() => Resident, (resident) => resident.services)
    @Exclude() // tránh circular reference khi serialize
    residents: Resident[];


}
