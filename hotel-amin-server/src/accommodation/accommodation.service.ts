import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Accommodation } from './accommodation.entity';
import { CreateAccommodationDto } from './DTOs/create-accommodation.dto';

@Injectable()
export class AccommodationService {
  constructor(
    @InjectRepository(Accommodation)
    private readonly accommodationRepository: Repository<Accommodation>,
  ) {}

  async create(
    createAccommodationDto: CreateAccommodationDto,
  ): Promise<Accommodation> {
    const accommodation = this.accommodationRepository.create(
      createAccommodationDto,
    );
    return this.accommodationRepository.save(accommodation);
  }

  async findAll(): Promise<Accommodation[]> {
    return this.accommodationRepository.find();
  }

  async findOne(id: number): Promise<Accommodation> {
    const accommodation = await this.accommodationRepository.findOne({
      where: { id },
    });

    if (!accommodation) {
      throw new Error(`Accommodation with ID ${id} not found`);
    }

    return accommodation;
  }
}
