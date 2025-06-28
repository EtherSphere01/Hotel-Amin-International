import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplainController } from './complain.controller';
import { ComplainService } from './complain.service';
import { Booking } from '../booking/entities/booking.entity';
import { Rooms } from '../room/entities/room.entity';
import { RoomItem } from '../room/entities/room-item.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Rooms, RoomItem]), EmailModule],
  controllers: [ComplainController],
  providers: [ComplainService],
  exports: [ComplainService],
})
export class ComplainModule {}
