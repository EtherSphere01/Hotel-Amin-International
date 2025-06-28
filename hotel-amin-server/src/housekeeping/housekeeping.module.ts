import { Module } from '@nestjs/common';
import { HousekeepingController } from './housekeeping.controller';
import { HousekeepingService } from './housekeeping.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousekeepingHistory } from './entities/housekeeping-history.entity';
import { HousekeepingRequest } from './entities/housekeeping-request.entity';
import { RoomModule } from '../room/room.module';
import { BookingModule } from '../booking/booking.module';
import { ManagementModule } from '../management/management.module';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [HousekeepingController],
  providers: [HousekeepingService],
  imports: [
    TypeOrmModule.forFeature([HousekeepingHistory, HousekeepingRequest]),
    RoomModule,
    BookingModule,
    ManagementModule,
    EmailModule,
  ],
})
export class HousekeepingModule {}
