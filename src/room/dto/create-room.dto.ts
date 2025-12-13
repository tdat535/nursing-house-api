import { IsString, IsNumber, IsEnum } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsEnum(['standard', 'vip', 'special_care'])
  type: 'standard' | 'vip' | 'special_care';

  @IsNumber()
  maxBeds: number;
}
