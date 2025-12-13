import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Room } from "./room.entity";
import { Bed } from "./bed.entity";
import { CreateRoomDto } from "./dto/create-room.dto";
import { ROOM_TYPE_CODE } from "./room-type-code";
import { IsNull } from 'typeorm';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private roomRepository: Repository<Room>,

        @InjectRepository(Bed)
        private bedRepository: Repository<Bed>,
    ) { }

    async createRoom(dto: CreateRoomDto) {
        let maxBeds = dto.maxBeds;
        if (dto.type === "special_care") maxBeds = 1;

        const room = this.roomRepository.create({
            name: dto.name,
            type: dto.type,
            maxBeds,
        });

        const savedRoom = await this.roomRepository.save(room);

        const typeCode = ROOM_TYPE_CODE[dto.type];

        const beds: Bed[] = [];
        for (let i = 1; i <= maxBeds; i++) {
            beds.push(
                this.bedRepository.create({
                    bedCode: `${typeCode}-${i}`,
                    bedNumber: i,
                    room: savedRoom,
                })
            );
        }

        await this.bedRepository.save(beds);

        return this.roomRepository.findOne({
            where: { id: savedRoom.id },
            relations: ["beds"],
        });
    }

    async getRooms() {
        try {
            const rooms = await this.roomRepository.find({
                relations: ['beds', 'beds.resident'], // load luôn resident để frontend tính còn/trống
            });

            return rooms; // wrap lại để frontend đỡ lỗi
        } catch (err) {
            console.error('Error in getRooms:', err);
            throw new InternalServerErrorException('Lỗi khi lấy danh sách phòng');
        }
    }

    // --- Lấy giường trống của 1 phòng ---
    async getAvailableBeds(roomId: number) {
        return this.bedRepository
            .createQueryBuilder('bed')
            .select(['bed.id', 'bed.bedCode', 'bed.bedNumber']) // chỉ lấy những field này
            .where('bed.roomId = :roomId', { roomId })
            .andWhere('bed.resident IS NULL')
            .getMany();
    }
}
