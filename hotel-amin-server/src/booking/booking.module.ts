import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Accounts } from './entities/accounts.entity';
import { Accommodation } from '../accommodation/accommodation.entity';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { CouponModule } from '../coupon/coupon.module';
import { ManagementModule } from '../management/management.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService],
  imports: [
    TypeOrmModule.forFeature([Accounts, Booking, Accommodation]),
    UserModule,
    RoomModule,
    CouponModule,
    ManagementModule,
  ],
  exports: [BookingService, TypeOrmModule],
})
export class BookingModule {}
