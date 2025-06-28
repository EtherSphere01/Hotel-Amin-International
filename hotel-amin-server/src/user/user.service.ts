import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashingProvider } from 'src/hash/hashing.provider';
import { UpdateUserDto } from './dtos/update-user.dto';
import { EmailService } from 'src/email/email.service'; // Add this import
import { join } from 'path';
import { readFileSync } from 'fs';
import * as ejs from 'ejs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashProvider: HashingProvider,
    @Inject(EmailService)
    private readonly emailService: EmailService,
  ) { }

  // Create User----------------------------------------------------
  public async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { phone: createUserDto.phone },
    });

    if (existingUser) {
      return { message: 'User already exists' };
    }

    const validUser = createUserDto;
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

      return user ? user : null;
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

  // Get All Users----------------------------------------------------
  public async getAllUsers() {
    try {
      const users = await this.userRepository.find({
        select: [
          'user_id',
          'name',
          'email',
          'phone',
          'address',
          'nationality',
          'profession',
          'age',
          'registrationDate',
          'role',
        ],
      });
      return users;
    } catch (error) {
      return { message: 'Error fetching users', error };
    }
  }

  // Get User By ID----------------------------------------------------
  public async getUserById(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: id },
        select: [
          'user_id',
          'name',
          'email',
          'phone',
          'address',
          'nid',
          'passport',
          'nationality',
          'profession',
          'age',
          'maritalStatus',
          'vehicleNo',
          'fatherName',
          'registrationDate',
          'role',
        ],
      });

      if (!user) {
        return { message: 'User not found' };
      }

      return user;
    } catch (error) {
      return { message: 'Error fetching user', error };
    }
  }

  // Update User By ID (Admin)----------------------------------------------------
  public async updateUserById(id: number, updateData: any) {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: id },
      });

      if (!user) {
        return { message: 'User not found' };
      }

      // Hash password if provided
      if (updateData.password) {
        updateData.password = await this.hashProvider.hashPassword(
          updateData.password,
        );
      }

      // Check if phone is being changed and if it already exists
      if (updateData.phone && updateData.phone !== user.phone) {
        const existingPhone = await this.userRepository.findOne({
          where: { phone: updateData.phone },
        });
        if (existingPhone) {
          return { message: 'Phone number already exists' };
        }
      }

      Object.assign(user, updateData);
      await this.userRepository.save(user);

      return { message: 'User updated successfully', user };
    } catch (error) {
      return { message: 'Error updating user', error };
    }
  }

  // Delete User----------------------------------------------------
  public async deleteUser(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { user_id: id },
      });

      if (!user) {
        return { message: 'User not found' };
      }

      await this.userRepository.remove(user);
      return { message: 'User deleted successfully' };
    } catch (error) {
      return { message: 'Error deleting user', error };
    }
  }
}
