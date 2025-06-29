import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { BookingReview } from './entities/booking-review.entity';
import { UserModule } from '../user/user.module';
import { User } from 'src/user/entities/user.entity';
import { Booking } from 'src/booking/entities/booking.entity';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService],
  imports: [
    TypeOrmModule.forFeature([Feedback, BookingReview, User, Booking]),
    UserModule,
  ],
})
export class FeedbackModule {}
