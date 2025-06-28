import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { HousekeepingService } from './housekeeping.service';
import { CreateHousekeepingDto } from './DTOs/create-housekeeping.dto';
import { CreateHousekeepingRequestDto } from './DTOs/create-housekeeping-request.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('housekeeping')
export class HousekeepingController {
  constructor(private readonly housekeepingService: HousekeepingService) {}

  @Post('create')
  create(@Body() dto: CreateHousekeepingDto) {
    return this.housekeepingService.create(dto);
  }

  @Get('all')
  findAll() {
    return this.housekeepingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.housekeepingService.findOne(+id);
  }
  @Get('room/:roomNum')
  findByRoom(@Param('roomNum', ParseIntPipe) roomNum: number) {
    return this.housekeepingService.findByRoomNum(roomNum);
  }

  @Patch(':id/report-issue')
  async reportIssue(
    @Param('id', ParseIntPipe) id: number,
    @Body('issue_report') issue: string,
  ) {
    return this.housekeepingService.reportIssue(id, issue);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.housekeepingService.remove(+id);
  }

  // New endpoint for guest housekeeping requests (public)
  @Auth(AuthType.None)
  @Post('request')
  async submitRequest(@Body() dto: CreateHousekeepingRequestDto) {
    return this.housekeepingService.submitRequest(dto);
  }

  // Admin endpoints for managing requests
  @Get('requests')
  async getAllRequests() {
    return this.housekeepingService.getAllRequests();
  }

  @Patch('request/:id/status')
  async updateRequestStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.housekeepingService.updateRequestStatus(id, status);
  }
}
