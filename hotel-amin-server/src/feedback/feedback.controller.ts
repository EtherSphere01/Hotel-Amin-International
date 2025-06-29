import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './DTOs/create-feedback.dto';
import { CreateBookingReviewDto } from './DTOs/create-booking-review.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Auth(AuthType.None)
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('submit')
  public async submitFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return await this.feedbackService.submitFeedback(createFeedbackDto);
  }

  @Get('all')
  public async getAllFeedback() {
    return await this.feedbackService.getAllFeedback();
  }

  @Get('user/:user_id')
  public async getFeedbackByUserId(@Param('user_id') userId: number) {
    return await this.feedbackService.getFeedbackByUserId(userId);
  }

  @Get('date/:date')
  public async getFeedbackByDate(@Param('date') date: Date) {
    return await this.feedbackService.getFeebackByDate(date);
  }


  @Post('booking-review')
  public async createBookingReview(
    @Body() createBookingReviewDto: CreateBookingReviewDto,
  ) {
    return await this.feedbackService.createBookingReview(
      createBookingReviewDto,
    );
  }

  @Get('booking-reviews')
  public async getAllBookingReviews() {
    return await this.feedbackService.getAllBookingReviews();
  }

  @Get('booking-review/:booking_id')
  public async getReviewByBookingId(@Param('booking_id') bookingId: number) {
    return await this.feedbackService.getReviewByBookingId(bookingId);
  }

  @Get('booking-reviews/user/:user_id')
  public async getBookingReviewsByUserId(@Param('user_id') userId: number) {
    return await this.feedbackService.getBookingReviewsByUserId(userId);
  }
}
