import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShowUserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(userId: string, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...dto,
        },
      });
      return new ShowUserDto(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUserPassword(userId: string, dto: UpdateUserPasswordDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const isValid = await argon.verify(user.password, dto.oldPassword);

      if (!isValid) {
        throw new ForbiddenException('Invalid credentials');
      }

      const pwMatches = dto.password === dto.verifyPassword;

      if (!pwMatches) {
        throw new ForbiddenException('Passwords do not match');
      }

      const hash = await argon.hash(dto.password);

      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { password: hash },
      });

      return new ShowUserDto(updatedUser);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: userId },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.user.delete({
        where: { id: userId },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}
