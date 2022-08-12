import { UpdateUserDto, UpdateUserPasswordDto, UserDto } from './dto/';
import { UserService } from './user.service';
import { JwtGuard } from '../auth/guard/';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from '../auth/decorator/';
import { User } from '@prisma/client';
import { Request } from 'express';
import { UserType } from './types';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  private readonly prefix: string = 'users:';

  constructor(private userService: UserService) {}

  @ApiOkResponse({
    description: 'All users have been successfully retreived',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users',
  })
  @Get()
  getUsers(@Req() req: Request): Promise<UserDto[]> {
    return this.userService.getUsers(req.url);
  }

  @ApiOkResponse({
    description: 'The user has been successfully retreived',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get the user making the request using id',
    description: 'Get the user making the request using id',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  async getMe(@GetUser() user: User, @Req() req: Request) {
    return this.userService.getMe(user, req.url);
  }

  @ApiOkResponse({
    description: 'The user has been successfully retreived',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get the user by id',
    description: 'Get the user by id',
  })
  @Get(':id')
  getUserById(@Param('id') id: string, @Req() req: Request): Promise<UserDto> {
    return this.userService.getUserById(id, req.url);
  }

  @ApiOkResponse({
    description: 'The user has been successfully created',
    type: UserDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update a user',
    description: 'Update a user',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch()
  editUser(
    @GetUser('id') userId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserType> {
    return this.userService.updateUser(userId, dto);
  }

  @ApiOkResponse({
    description: 'The password has been successfully updated',
    type: UpdateUserPasswordDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update the password',
    description: 'Update the password',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('password')
  updateUserPassword(
    @GetUser('id') userId: string,
    @Body() dto: UpdateUserPasswordDto,
  ) {
    return this.userService.updateUserPassword(userId, dto);
  }

  @ApiOkResponse({
    description: 'The user has been successfully deleted',
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Delete a user',
  })
  @Delete()
  deleteUser(@GetUser('id') userId: string) {
    return this.userService.deleteUser(userId);
  }
}
