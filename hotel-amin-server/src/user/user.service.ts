import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashingProvider } from 'src/hash/hashing.provider';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { EmailService } from 'src/email/email.service';
import { Reservation } from '../reservation/entities/reservation.entity';
import { join } from 'path';
import { readFileSync } from 'fs';
import * as ejs from 'ejs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly hashProvider: HashingProvider,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) {}

  // Create User----------------------------------------------------
  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    });

    if (existingUser) {
      return { message: 'User already exists' };
    }

    let validUser = createUserDto;
    validUser.registrationDate = new Date();
    validUser.password = await this.hashProvider.hashPassword(
      createUserDto.password,
    );
    try {
      const newUser = this.userRepository.create(validUser);
      await this.userRepository.save(newUser);
      if (newUser.email) {
        await this.sendWelcomeEmail(newUser.email, createUserDto);
      }
      return { user: newUser };
    } catch (error) {
      return { message: 'Error creating user', error };
    }
  }

  // Update User----------------------------------------------------
  public async updateUser(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { phone: updateUserDto.previousPhone },
    });

    if (!user) {
      return { message: 'User not found' };
    }
    const existingPassword = await this.hashProvider.comparePassword(
      updateUserDto.previousPassword,
      user.password,
    );

    if (!existingPassword) {
      return { message: 'password is incorrect' };
    }

    if (updateUserDto.phone) {
      const existPhone = await this.userRepository.findOne({
        where: { phone: updateUserDto.phone },
      });
      if (existPhone) {
        return { message: 'Phone number already exists' };
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await this.hashProvider.hashPassword(
        updateUserDto.password,
      );
    }
    Object.assign(user, updateUserDto);

    try {
      await this.userRepository.save(user);
      return { message: 'User updated successfully', user };
    } catch (error) {
      return { message: 'Error updating user', error };
    }
  }

  // Update Profile (without password validation)----------------------------------------------------
  public async updateProfile(
    userId: number,
    updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) {
      return { message: 'User not found' };
    }

    // Check if phone number is being changed and if it already exists
    if (updateProfileDto.phone && updateProfileDto.phone !== user.phone) {
      const existPhone = await this.userRepository.findOne({
        where: { phone: updateProfileDto.phone },
      });
      if (existPhone) {
        return { message: 'Phone number already exists' };
      }
    }

    // Update user fields
    Object.assign(user, updateProfileDto);

    try {
      await this.userRepository.save(user);
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      return {
        message: 'Profile updated successfully',
        user: userWithoutPassword,
      };
    } catch (error) {
      return { message: 'Error updating profile', error };
    }
  }

  // Find User By Phone----------------------------------------------------
  public async findUserByPhone(phone: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { phone: phone },
      });

      return user ? user : null;
    } catch (error) {
      return error;
    }
  }

  // Find User By ID----------------------------------------------------
  public async findUserById(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: id },
      });

      if (user) {
        // Remove password from response for security
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    } catch (error) {
      return error;
    }
  }

  // Welcome Mail----------------------------------------------------

  private async sendWelcomeEmail(email: string, createUserDto?: CreateUserDto) {
    try {
      const possiblePaths = [
        join(process.cwd(), 'src', 'email', 'templates', 'welcome.ejs'),
        join(process.cwd(), 'dist', 'email', 'templates', 'welcome.ejs'),
        join(__dirname, '..', '..', 'email', 'templates', 'welcome.ejs'),
      ];
      let template;
      for (const path of possiblePaths) {
        try {
          console.log('Trying path:', path);
          template = readFileSync(path, 'utf8');
          break;
        } catch (e) {
          continue;
        }
      }
      if (!template) {
        throw new Error('Template not found in any location');
      }
      const html = ejs.render(template, {
        username: createUserDto?.name,
      });
      await this.emailService.sendEmail({
        recipients: [email],
        subject: 'Welcome to Amin Hotel',
        html: html,
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      await this.emailService.sendEmail({
        recipients: [email],
        subject: 'Welcome to Our Service!',
        html: `<p>Welcome ${email.split('@')[0]}!</p>`,
      });
    }
  }

  // Get User Booking History----------------------------------------------------
  public async getUserBookingHistory(userId: number) {
    try {
      console.log('Fetching booking history for user ID:', userId);

      // First, let's check if there are any reservations at all for this user WITHOUT relations
      const reservationsWithoutRelations =
        await this.reservationRepository.find({
          where: { user_id: userId },
          order: { reservation_date: 'DESC' },
        });

      console.log(
        'Found reservations without relations:',
        reservationsWithoutRelations.length,
      );

      // Now try with relations
      const reservations = await this.reservationRepository.find({
        where: { user_id: userId },
        relations: ['rooms'],
        order: { reservation_date: 'DESC' },
      });

      console.log('Found reservations with relations:', reservations.length);
      console.log('Reservations data:', JSON.stringify(reservations, null, 2));

      // Also check if there are any reservations in the database at all
      const allReservations = await this.reservationRepository.find();
      console.log('Total reservations in database:', allReservations.length);

      return reservations.map((reservation) => ({
        booking_id: reservation.reservation_id,
        checkin_date: reservation.checkin_date,
        checkout_date: reservation.checkout_date,
        number_of_guests: reservation.number_of_guests,
        room_price: reservation.room_price,
        discount_price: reservation.discount_price,
        total_price: reservation.total_price,
        booking_date: reservation.reservation_date,
        payment_status: 'PAID',
        typeOfBooking: reservation.typeOfBooking,
        room:
          reservation.rooms && reservation.rooms.length > 0
            ? {
                room_num: reservation.rooms[0].room_num,
                type: reservation.rooms[0].type,
                floor: reservation.rooms[0].floor,
              }
            : null,
      }));
    } catch (error) {
      console.error('Error fetching booking history:', error);
      return [];
    }
  }
}
