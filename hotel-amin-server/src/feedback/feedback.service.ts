import {
  Body,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { BookingReview } from './entities/booking-review.entity';
import { User } from 'src/user/entities/user.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { CreateFeedbackDto } from './DTOs/create-feedback.dto';
import { CreateBookingReviewDto } from './DTOs/create-booking-review.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
    @InjectRepository(BookingReview)
    private readonly bookingReviewRepository: Repository<BookingReview>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}
  public async submitFeedback(createFeedbackDto: CreateFeedbackDto) {
    const user = await this.userRepository.findOneBy({
      user_id: createFeedbackDto.user_id,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    feedback.user = user;
    return await this.feedbackRepository.save(feedback);
  }

  public async getAllFeedback() {
    return await this.feedbackRepository.find({ relations: ['user'] });
  }

  public async getFeedbackByUserId(userId: number) {
    const feedback = await this.feedbackRepository.find({
      where: { user: { user_id: userId } },
      relations: ['user'],
    });
    if (!feedback) {
      throw new NotFoundException('Feedback not found for this user');
    }
    return feedback;
  }

  public async getFeebackByDate(date: Date) {
    const feedback = await this.feedbackRepository.find({
      where: { date: date },
      relations: ['user'],
    });
    if (!feedback) {
      throw new NotFoundException('Feedback not found for this date');
    }
    return feedback;
  }

  public async createBookingReview(
    createBookingReviewDto: CreateBookingReviewDto,
  ) {
    const user = await this.userRepository.findOneBy({
      user_id: createBookingReviewDto.user_id,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const booking = await this.bookingRepository.findOneBy({
      booking_id: createBookingReviewDto.booking_id,
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const existingReview = await this.bookingReviewRepository.findOne({
      where: { booking: { booking_id: createBookingReviewDto.booking_id } },
    });
    if (existingReview) {
      throw new BadRequestException('Review already exists for this booking');
    }

    const review = this.bookingReviewRepository.create({
      review_text: createBookingReviewDto.review_text,
      rating: createBookingReviewDto.rating,
      guest_name: createBookingReviewDto.guest_name || user.name,
      user,
      booking,
    });

    return await this.bookingReviewRepository.save(review);
  }

  public async getAllBookingReviews() {
    return await this.bookingReviewRepository.find({
      relations: ['user', 'booking'],
      order: { created_date: 'DESC' },
    });
  }

  public async getBookingReviewsByUserId(userId: number) {
    return await this.bookingReviewRepository.find({
      where: { user: { user_id: userId } },
      relations: ['user', 'booking'],
      order: { created_date: 'DESC' },
    });
  }

  public async getReviewByBookingId(bookingId: number) {
    return await this.bookingReviewRepository.findOne({
      where: { booking: { booking_id: bookingId } },
      relations: ['user', 'booking'],
    });
  }
}
