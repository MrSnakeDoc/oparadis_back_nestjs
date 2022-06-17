import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { UserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto';

@Injectable()
export class UserService {
  private readonly prefix: string = 'users:';

  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
  ) {}

  async updateUser(userId: string, dto: UpdateUserDto): Promise<UserDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...dto,
        },
      });

      await this.cache.del(this.prefix);

      return new UserDto(user);
    } catch (error) {
      throw error;
    }
  }

  async updateUserPassword(
    userId: string,
    dto: UpdateUserPasswordDto,
  ): Promise<UpdateUserPasswordDto> {
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

      return new UserDto(updatedUser);
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

      await this.cache.del(this.prefix);

      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }
}
