import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
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
import { UserType } from './types';

@Injectable()
export class UserService {
  private readonly prefix: string = 'users:';
  private readonly folder: string = 'avatars';
  private readonly urlPrefix: string = 'avatars/';
  private readonly defaultAvatar: string =
    'https://res.cloudinary.com/oparadis/image/upload/v1655907032/avatars/fpc9avx8ypafd2yxuo2b.png';

  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private cloudinary: CloudinaryService,
  ) {}

  async getUsers(url: string): Promise<UserDto[]> {
    try {
      const users = await this.cache.get(`${this.prefix}${url}`);

      if (users) {
        return users;
      }

      const storedUsers: UserType[] = await this.prisma.user.findMany();

      const usersDto: UserDto[] = storedUsers.map((user) => {
        delete user.password;
        delete user.refresh_token;
        return user;
      });

      await this.cache.set(this.prefix, usersDto);

      return usersDto;
    } catch (error) {
      throw error;
    }
  }
  async getUserById(id, url): Promise<UserType> {
    try {
      const users: UserType = await this.cache.get(`${this.prefix}${url}`);

      if (users) {
        return users;
      }

      const storedUsers: UserType = await this.prisma.user.findUnique({
        where: { id },
      });

      const userDto: UserDto = Object.assign({}, storedUsers);
      delete userDto.password;
      delete userDto.refresh_token;

      await this.cache.set(this.prefix, userDto);

      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<UserDto> {
    try {
      const storedUser = await this.prisma.user.findFirst({
        where: { id: userId },
      });

      if (!storedUser)
        throw new ForbiddenException('Access to ressources denied');

      const data: UpdateUserDto = { ...dto };
      delete data.avatar_delete;

      if (dto.avatar_delete && storedUser.avatar !== this.defaultAvatar) {
        const cloudDelete = await this.cloudinary.delete(
          storedUser.avatar,
          this.urlPrefix,
        );

        if (cloudDelete.result !== 'ok')
          throw new HttpException(
            'error delete cloudinary img !',
            HttpStatus.EXPECTATION_FAILED,
          );
        data.avatar = this.defaultAvatar;
      }

      if (dto.avatar) {
        if (storedUser.avatar !== this.defaultAvatar) {
          const cloudDelete = await this.cloudinary.delete(
            storedUser.avatar,
            this.urlPrefix,
          );

          if (cloudDelete.result !== 'ok')
            throw new HttpException(
              'error delete cloudinary img !',
              HttpStatus.EXPECTATION_FAILED,
            );
        }
        data.avatar = await this.cloudinary.upload(dto.avatar, this.folder);
      }

      const user = await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...data,
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
  ): Promise<UserDto> {
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

      const pwMatches = dto.password === dto.confirmationPassword;

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
      const storedUser = await this.prisma.user.findFirst({
        where: { id: userId },
      });

      if (!storedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (storedUser.avatar !== this.defaultAvatar) {
        const cloudDelete = await this.cloudinary.delete(
          storedUser.avatar,
          this.urlPrefix,
        );

        if (cloudDelete.result !== 'ok')
          throw new HttpException(
            'error delete cloudinary img !',
            HttpStatus.EXPECTATION_FAILED,
          );
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
