import {
  Body,
  Controller,
  Patch,
  Post,
  Get,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

// @UseGuards(AccessTokenGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(AuthType.None)
  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch('updateUser')
  @Roles('customer')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @Get('profile')
  @Auth(AuthType.Bearer)
  async getProfile(@ActiveUser() user: ActiveUserData) {
    return this.userService.findUserById(user.sub);
  }

  @Patch('profile')
  @Auth(AuthType.Bearer)
  async updateProfile(
    @ActiveUser() user: ActiveUserData,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(user.sub, updateProfileDto);
  }

  @Get('booking-history')
  @Auth(AuthType.Bearer)
  async getBookingHistory(@ActiveUser() user: ActiveUserData) {
    console.log('Booking history endpoint called for user:', user);
    console.log('User ID:', user.sub);
    return this.userService.getUserBookingHistory(user.sub);
  }
}
