import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './DTOs/create-booking.dto';
import { CreateAccommodationBookingDto } from './DTOs/create-accommodation-booking.dto';
import { CreateGuestBookingDto } from './DTOs/create-guest-booking.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Auth(AuthType.None)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Get('all')
  findAll() {
    return this.bookingService.findAll();
  }

  @Post('create')
  createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }

  @Post('create-accommodation')
  @Auth(AuthType.Bearer)
  createAccommodationBooking(
    @Body() dto: CreateAccommodationBookingDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.bookingService.createAccommodationBooking(dto, user.sub);
  }

  @Post('create-guest')
  createGuestBooking(@Body() dto: CreateGuestBookingDto) {
    return this.bookingService.createGuestBooking(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookingService.findBooking(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: Partial<CreateBookingDto>) {
    return this.bookingService.updateBooking(+id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bookingService.deleteBooking(+id);
  }
}
