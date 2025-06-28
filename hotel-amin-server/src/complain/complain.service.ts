import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComplaintDto } from './DTOs/create-complaint.dto';
import { Booking } from '../booking/entities/booking.entity';
import { Rooms } from '../room/entities/room.entity';
import { RoomItem } from '../room/entities/room-item.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class ComplainService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Rooms)
    private readonly roomRepository: Repository<Rooms>,
    @InjectRepository(RoomItem)
    private readonly roomItemRepository: Repository<RoomItem>,
    private readonly emailService: EmailService,
  ) {}

  async reportComplaint(createComplaintDto: CreateComplaintDto) {
    const { phone_number, room_num, item_name, status, issue_description } =
      createComplaintDto;

    try {
      // Verify that the room exists
      const room = await this.roomRepository.findOne({
        where: { room_num },
      });

      if (!room) {
        throw new NotFoundException(`Room ${room_num} does not exist`);
      }

      // Verify that the item exists in the specified room
      const roomItem = await this.roomItemRepository.findOne({
        where: {
          room: { room_num },
          item_name,
        },
        relations: ['room'],
      });

      if (!roomItem) {
        throw new NotFoundException(
          `Item '${item_name}' not found in Room ${room_num}`,
        );
      }

      // Get hotel email from environment or use default
      const hotelEmail = process.env.EMAIL_USER || 'universuswebtech@gmail.com';

      // Send complaint email asynchronously without blocking the response
      this.emailService
        .sendEmail({
          recipients: [hotelEmail],
          subject: `Guest Complaint - Room ${room_num} - ${item_name}`,
          html: `
          <h2>Guest Complaint Report</h2>
          <p><strong>Room Number:</strong> ${room_num}</p>
          <p><strong>Item:</strong> ${item_name}</p>
          <p><strong>Current Status:</strong> ${status}</p>
          <p><strong>Guest Phone:</strong> ${phone_number}</p>
          <p><strong>Issue Description:</strong></p>
          <p>${issue_description}</p>
          <p><strong>Reported At:</strong> ${new Date().toLocaleString()}</p>
        `,
        })
        .catch((error) => {
          console.error('Failed to send complaint email:', error);
        });

      return {
        success: true,
        message:
          'Complaint submitted successfully. Hotel management has been notified.',
        room_number: room_num,
        item: item_name,
        status: status,
        phone_number: phone_number,
      };
    } catch (error) {
      console.error('Error in reportComplaint:', error);
      throw error;
    }
  }
}
