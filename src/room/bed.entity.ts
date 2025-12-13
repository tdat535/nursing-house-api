import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Room } from './room.entity';
import { Resident } from '../residents/entities/resident.entity';

@Entity('beds')
export class Bed {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bedCode: string;

    @Column()
    bedNumber: number;

    @ManyToOne(() => Room, room => room.beds, { onDelete: 'CASCADE' })
    room: Room;

    @OneToOne(() => Resident, resident => resident.bed, { nullable: true })
    @JoinColumn()
    resident: Resident | null;

}
