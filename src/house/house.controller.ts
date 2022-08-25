import { HouseService } from './house.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { CreateHouseDto, UpdateHouseDto } from './dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HouseType } from './types';

@ApiBearerAuth()
@ApiTags('houses')
@UseGuards(JwtGuard)
@Controller('houses')
export class HouseController {
  constructor(private HouseService: HouseService) {}

  @ApiOkResponse({
    description: 'The houses have been successfully retreived.',
    type: HouseType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary:
      'Get all houses of all users with associated photos, type and country',
    description:
      'Get all houses of all users with associated photos, type, and country',
  })
  @Get('/full')
  getHousesFull(@Req() req: Request) {
    return this.HouseService.getHousesFull(req.url);
  }

  @ApiOkResponse({
    description: 'The house has been successfully retreived.',
    type: HouseType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get a house by id',
    description: 'Get a house by id',
  })
  @Get(':id')
  getHouseById(@Param('id') houseId: string, @Req() req: Request) {
    return this.HouseService.getHouseById(houseId, req.url);
  }

  @ApiOkResponse({
    description: 'The house has been successfully created',
    type: HouseType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Create a new house',
    description: 'Create a new house',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createHouse(@GetUser('id') userId: string, @Body() dto: CreateHouseDto) {
    return this.HouseService.createHouse(userId, dto);
  }

  @ApiOkResponse({
    description: 'The house has been successfully updated',
    type: HouseType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update a house',
    description: 'Update a house',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updateHouse(
    @GetUser('id') userId: string,
    @Param('id') houseId: string,
    @Body() dto: UpdateHouseDto,
  ) {
    return this.HouseService.updateHouse(userId, houseId, dto);
  }

  @ApiOkResponse({
    description: `${HttpStatus.OK}`,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Delete a house',
    description: 'Delete a house',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  deleteHouse(@GetUser('id') userId: string, @Param('id') houseId: string) {
    return this.HouseService.deleteHouse(userId, houseId);
  }
}
