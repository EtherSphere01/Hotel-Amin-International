import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';
import { ItemStatus } from '../../room/entities/room-item.entity';

export class CreateComplaintDto {
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @IsNumber()
  @IsNotEmpty()
  room_num: number;

  @IsString()
  @IsNotEmpty()
  item_name: string;

  @IsEnum(ItemStatus)
  status: ItemStatus;

  @IsString()
  @IsNotEmpty()
  issue_description: string;
}
