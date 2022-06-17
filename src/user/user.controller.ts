import { UpdateUserDto, UpdateUserPasswordDto, UserDto } from './dto/';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard/';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/';
import { User } from '@prisma/client';
import { Request } from 'express';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { UserType } from './types';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  private readonly prefix: string = 'users:';

  constructor(
    private userService: UserService,
    private cache: RedisCacheService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  async getMe(@GetUser() user: User, @Req() req: Request) {
    const cachedUser: UserType = await this.cache.get(
      `${this.prefix}${req.url}${user.id}`,
    );

    if (cachedUser) return cachedUser;

    const cacheUser: UserType = Object.assign({}, user);
    delete cacheUser.password;
    delete cacheUser.refresh_token;

    await this.cache.set(`${this.prefix}${req.url}${user.id}`, cacheUser);

    return new UserDto(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch()
  editUser(@GetUser('id') userId: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(userId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('password')
  updateUserPassword(
    @GetUser('id') userId: string,
    @Body() dto: UpdateUserPasswordDto,
  ) {
    return this.userService.updateUserPassword(userId, dto);
  }

  @Delete()
  deleteUser(@GetUser('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
