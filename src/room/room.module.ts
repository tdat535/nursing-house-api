import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { Room } from "./room.entity";
import { Bed } from "./bed.entity";

import { RoomService } from "./room.service";
import { RoomController } from "./room.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Room, Bed])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
