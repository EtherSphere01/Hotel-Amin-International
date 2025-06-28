import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { HousekeepingStatus, RoomStatus } from '../entities/room.entity';

export class UpdateRoomDto {
    @IsOptional()
    @IsNumber()
    floor?: number;

    @IsOptional()
    @IsNumber()
    capacity?: number;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    room_price?: number;

    @IsOptional()
    @IsNumber()
    discount?: number;

    @IsOptional()
    @IsEnum(RoomStatus)
    room_status?: RoomStatus;

    @IsOptional()
    @IsEnum(HousekeepingStatus)
    housekeeping_status?: HousekeepingStatus;
}
