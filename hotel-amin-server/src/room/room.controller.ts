import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './DTOs/create-room.dto';
import { UpdateRoomDto } from './DTOs/update-room.dto';
import { CreateRoomItemDto } from './DTOs/create-roomItem.dto';
import { UpdateRoomStatusDto } from './DTOs/update-room-status.dto';
import { UpdateHousekeepingStatusDto } from './DTOs/hk-status.dto';
import { ReportItemIssueDto } from './DTOs/report-item-issue.dto';
import { UpdateRoomItemDto } from './DTOs/update-roomItem.dto';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetRoomsDto } from './DTOs/get-rooms-dto';
import { SearchRoomsDto } from './DTOs/search-rooms.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Auth(AuthType.None)
  @Get('all')
  public getAllRooms(@Query() roomQuery: GetRoomsDto) {
    return this.roomService.getAllRooms(roomQuery);
  }

  @Roles('admin', 'customer')
  @Get('by-status/:room_status')
  public getRoomsByStatus(@Param('room_status') roomStatus: string) {
    return this.roomService.getRoomsByStatus(roomStatus);
  }

  @Roles('admin')
  @Post('create')
  public createRoom(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.createRoom(createRoomDto);
  }

  @Roles('admin')
  @Post('create-item')
  public createRoomItem(@Body() createRoomItemDto: CreateRoomItemDto) {
    return this.roomService.createRoomItem(createRoomItemDto);
  }

  @Roles('admin')
  @Patch('update-room-item/:room_num/:item_name')
  public updateRoomItem(
    @Param('room_num', ParseIntPipe) roomNum: number,
    @Param('item_name') itemName: string,
    @Body() UpdateRoomItemDto: UpdateRoomItemDto,
  ) {
    return this.roomService.updateRoomItem(
      roomNum,
      itemName,
      UpdateRoomItemDto,
    );
  }

  @Auth(AuthType.None)
  @Put('update/:room_num')
  public updateRoom(
    @Param('room_num', ParseIntPipe) roomNum: number,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return this.roomService.updateRoom(roomNum, updateRoomDto);
  }

  @Auth(AuthType.None)
  @Put('update-status/:room_num')
  public updateRoomStatus(
    @Param('room_num', ParseIntPipe) roomNum: number,
    @Body() updateRoomStatusDto: UpdateRoomStatusDto,
  ) {
    return this.roomService.updateRoomStatus(roomNum, updateRoomStatusDto);
  }

  @Roles('admin', 'customer')
  @Put('update-hk-status/:room_num')
  public updateHousekeepingStatus(
    @Param('room_num', ParseIntPipe) roomNum: number,
    @Body() updateHKSDto: UpdateHousekeepingStatusDto,
  ) {
    return this.roomService.updateHousekeepingStatus(roomNum, updateHKSDto);
  }

  @Auth(AuthType.None)
  @Patch(':room_num/items/report-issue/:item_name')
  public reportIssue(
    @Param('room_num', ParseIntPipe) roomNum: number,
    @Param('item_name') itemName: string,
    @Body() ReportItemIssueDto: ReportItemIssueDto,
  ) {
    return this.roomService.reportIssue(roomNum, itemName, ReportItemIssueDto);
  }

  @Auth(AuthType.None)
  @Delete('delete/:room_num')
  public deleteRoom(@Param('room_num', ParseIntPipe) roomNum: number) {
    return this.roomService.deleteRoom(roomNum);
  }

  @Auth(AuthType.None)
  @Get(':room_num/items')
  public getRoomItems(@Param('room_num', ParseIntPipe) roomNum: number) {
    return this.roomService.getRoomItems(roomNum);
  }

  @Auth(AuthType.None)
  @Post('search')
  @UsePipes(ValidationPipe)
  public searchAvailableRooms(@Body() searchDto: SearchRoomsDto) {
    return this.roomService.searchAvailableRooms(
      searchDto.checkIn,
      searchDto.checkOut,
      searchDto.guests,
    );
  }
}
