import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { PlantDto, UpdatePlantDto } from './dto';
import { PlantService } from './plant.service';
import { PlantType } from './types';

@ApiBearerAuth()
@ApiTags('plants')
@UseGuards(JwtGuard)
@Controller('plants')
export class PlantController {
  constructor(private PlantService: PlantService) {}

  @ApiOkResponse({
    description: 'The plants have been successfully retreived',
    type: PlantType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all plants of all users',
    description: 'Get all plants of all users',
  })
  @Get()
  getPlants(@Req() req: Request): Promise<PlantType[]> {
    return this.PlantService.getPlants(req.url);
  }

  @ApiOkResponse({
    description: 'The plants has been successfully retreived',
    type: PlantType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get a plants by id',
    description: 'Get a plants by id',
  })
  @Get(':id')
  getPlantById(
    @Param('id') PlantId: string,
    @Req() req: Request,
  ): Promise<PlantType> {
    return this.PlantService.getPlantById(PlantId, req.url);
  }

  @ApiOkResponse({
    description: 'The plants have been successfully',
    type: PlantType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all plants belonging to a user',
    description: 'Get all plants belonging to a user',
  })
  @Get('/user/:user_id')
  getAnimalByUserId(
    @Param('user_id') user_id: string,
    @Req() req: Request,
  ): Promise<PlantType[]> {
    return this.PlantService.getPlantByUserId(user_id, req.url);
  }

  @ApiOkResponse({
    description: 'The plant has been successfully created',
    type: PlantType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Create a new plant',
    description: 'Create a new plant',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createPlant(
    @GetUser('id') user_id: string,
    @Body() dto: PlantDto,
  ): Promise<PlantType> {
    return this.PlantService.createPlant(user_id, dto);
  }

  @ApiOkResponse({
    description: 'The plant has been successfully updated',
    type: PlantType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update a plant',
    description: 'Update a plant',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updatePlant(
    @GetUser('id') user_id: string,
    @Param('id') PlantId: string,
    @Body() dto: UpdatePlantDto,
  ): Promise<PlantType> {
    return this.PlantService.updatePlant(user_id, PlantId, dto);
  }

  @ApiOkResponse({
    description: 'The photo has been successfully deleted',
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Delete a photo',
    description: 'Delete a photo',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  deletePlant(@GetUser('id') user_id: string, @Param('id') PlantId: string) {
    return this.PlantService.deletePlant(user_id, PlantId);
  }
}
