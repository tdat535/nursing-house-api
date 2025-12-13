import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) { }

    @Get()
    getRooms() {
        return this.roomService.getRooms();
    }

    @Post()
    create(@Body() dto: CreateRoomDto) {
        return this.roomService.createRoom(dto);
    }

    @Get(':id/available-beds')
    getAvailableBeds(@Param('id') id: string) {
        return this.roomService.getAvailableBeds(Number(id));
    }
}
