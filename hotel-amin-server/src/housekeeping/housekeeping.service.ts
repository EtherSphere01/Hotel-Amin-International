import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HousekeepingHistory } from './entities/housekeeping-history.entity';
import { HousekeepingRequest } from './entities/housekeeping-request.entity';
import { CreateHousekeepingDto } from './DTOs/create-housekeeping.dto';
import { CreateHousekeepingRequestDto } from './DTOs/create-housekeeping-request.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class HousekeepingService {
  private readonly logger = new Logger(HousekeepingService.name);

  constructor(
    @InjectRepository(HousekeepingHistory)
    private readonly housekeepingRepo: Repository<HousekeepingHistory>,
    @InjectRepository(HousekeepingRequest)
    private readonly housekeepingRequestRepo: Repository<HousekeepingRequest>,
    private readonly emailService: EmailService,
  ) {}

  public async create(dto: CreateHousekeepingDto) {
    const housekeeping = new HousekeepingHistory();

    housekeeping.date = new Date(dto.date);
    housekeeping.type_of_service = dto.type_of_service;
    housekeeping.issue_report = dto.issue_report;
    housekeeping.cleaner_feedback = dto.cleaner_feedback;

    housekeeping.room = { room_num: dto.room } as any; 
    housekeeping.cleaned_by = { employee_id: dto.cleaned_by } as any; 
    housekeeping.supervisor = { employee_id: dto.supervisor } as any; 

    if (dto.booking) {
      housekeeping.booking = { booking_id: dto.booking } as any; 
    }

    return this.housekeepingRepo.save(housekeeping);
  }

  public findAll() {
    return this.housekeepingRepo.find({
      relations: ['room', 'cleaned_by', 'supervisor', 'booking'],
    });
  }

  public findOne(id: number) {
    return this.housekeepingRepo.findOne({
      where: { housekeeping_id: id },
      relations: ['room', 'cleaned_by', 'supervisor', 'booking'],
    });
  }

  public async remove(id: number) {
    const entry = await this.housekeepingRepo.findOneBy({
      housekeeping_id: id,
    });
    if (!entry) throw new NotFoundException('Entry not found');
    return this.housekeepingRepo.remove(entry);
  }
  public async findByRoomNum(room_num: number) {
    return this.housekeepingRepo.find({
      where: {
        room: { room_num },
      },
      relations: ['room', 'cleaned_by', 'supervisor', 'booking'],
    });
  }
  public async reportIssue(id: number, issue: string) {
    const entry = await this.housekeepingRepo.findOneBy({
      housekeeping_id: id,
    });
    if (!entry) throw new NotFoundException('Housekeeping entry not found');

    entry.issue_report = issue;
    return this.housekeepingRepo.save(entry);
  }

  public async submitRequest(dto: CreateHousekeepingRequestDto) {
    try {
      this.logger.log(`Submitting housekeeping request for room ${dto.room}`);

      const request = new HousekeepingRequest();
      request.room = dto.room;
      request.phone = dto.phone;
      request.description = dto.description;

      const savedRequest = await this.housekeepingRequestRepo.save(request);
      this.logger.log(`Housekeeping request saved with ID: ${savedRequest.id}`);

      setImmediate(async () => {
        try {
          await this.emailService.sendHousekeepingRequestEmail({
            room: dto.room,
            phone: dto.phone,
            description: dto.description || 'No description provided',
            requestId: savedRequest.id,
          });
          this.logger.log(
            `Housekeeping request email sent for request ID: ${savedRequest.id}`,
          );
        } catch (emailError) {
          this.logger.warn(
            `Failed to send housekeeping request email: ${emailError.message}`,
          );
        }
      });

      return {
        success: true,
        message: 'Housekeeping request submitted successfully',
        data: savedRequest,
      };
    } catch (error) {
      this.logger.error(
        `Error submitting housekeeping request: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  public async getAllRequests() {
    return this.housekeepingRequestRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  public async updateRequestStatus(id: number, status: string) {
    const request = await this.housekeepingRequestRepo.findOneBy({ id });
    if (!request) {
      throw new NotFoundException('Housekeeping request not found');
    }

    request.status = status as any;
    return this.housekeepingRequestRepo.save(request);
  }
}
