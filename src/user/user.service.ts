import { CloudinaryService } from '../cloudinary/cloudinary.service';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { UserDto, UpdateUserDto, UpdateUserPasswordDto } from './dto';
import { UserType } from './types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly prefix: string = 'users:';
  private readonly folder: string = 'avatars';
  private readonly urlPrefix: string = 'avatars/';

  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private cloudinary: CloudinaryService,
    private config: ConfigService,
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

      await this.cache.set(
        `${this.prefix}${url}`,
        usersDto,
        this.config.get('CACHE_TTL'),
      );

      return usersDto;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id, url): Promise<UserType> {
    try {
      const user: UserType = await this.cache.get(`${this.prefix}${url}`);

      if (user) {
        return user;
      }

      const storedUser: UserType = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!storedUser)
        throw new HttpException(
          `No User with id ${id} found`,
          HttpStatus.NOT_FOUND,
        );

      const userDto: UserDto = Object.assign({}, storedUser);
      delete userDto.password;
      delete userDto.refresh_token;

      await this.cache.set(
        `${this.prefix}${url}`,
        userDto,
        this.config.get('CACHE_TTL'),
      );

      return userDto;
    } catch (error) {
      throw error;
    }
  }

  async getMe(user, url): Promise<UserType> {
    const cachedUser: UserType = await this.cache.get(
      `${this.prefix}${url}${user.id}`,
    );

    if (cachedUser) return cachedUser;

    const cacheUser: UserType = Object.assign({}, user);
    delete cacheUser.password;
    delete cacheUser.refresh_token;

    cacheUser.house = await this.prisma.house.findUnique({
      where: {
        user_id: user.id,
      },
    });

    cacheUser.animals = await this.prisma.animal.findMany({
      where: {
        user_id: user.id,
      },
    });

    cacheUser.plants = await this.prisma.plant.findMany({
      where: {
        user_id: user.id,
      },
    });

    await this.cache.set(
      `${this.prefix}${url}${user.id}`,
      cacheUser,
      this.config.get('CACHE_TTL'),
    );

    return new UserType(cacheUser);
  }

  async updateUser(userId: string, dto: UpdateUserDto): Promise<UserDto> {
    try {
      const storedUser: UserType = await this.prisma.user.findFirst({
        where: { id: userId },
      });

      if (!storedUser)
        throw new ForbiddenException('Access to ressources denied');

      const data: UpdateUserDto = { ...dto };

      if (dto.avatar || dto.avatar === null)
        data.avatar = await this.cloudinary.processImg(
          dto.avatar,
          storedUser.avatar,
          this.urlPrefix,
          this.folder,
        );

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

      if (storedUser.avatar)
        await this.cloudinary.delete(storedUser.avatar, this.urlPrefix);

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
