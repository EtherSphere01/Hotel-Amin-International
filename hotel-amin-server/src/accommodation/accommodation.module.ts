import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccommodationController } from './accommodation.controller';
import { AccommodationService } from './accommodation.service';
import { Accommodation } from './accommodation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Accommodation])],
  controllers: [AccommodationController],
  providers: [AccommodationService],
})
export class AccommodationModule {}
