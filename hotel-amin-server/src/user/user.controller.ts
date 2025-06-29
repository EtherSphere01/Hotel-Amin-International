import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
import { UpdateUserAdminDto } from './dtos/update-user-admin.dto';
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
  @Get('all')
  async getAllUsers() {
    return this.userService.getAllUsers();
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

  @Auth(AuthType.None)
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Auth(AuthType.None)
  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Auth(AuthType.None)
  @Put('update/:id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserAdminDto,
  ) {
    return this.userService.updateUserById(id, updateUserDto);
  }

  @Patch('updateUser')
  @Roles('customer')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @Auth(AuthType.None)
  @Delete('delete/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
