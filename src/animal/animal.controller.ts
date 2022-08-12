import { AnimalType } from 'src/animal/types/';
import { AnimalService } from './animal.service';
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
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { AnimalDto, UpdateAnimalDto } from './dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('animals')
@UseGuards(JwtGuard)
@Controller('animals')
export class AnimalController {
  constructor(private AnimalService: AnimalService) {}

  @ApiOkResponse({
    description: 'The Animals have been successfully retreived.',
    type: AnimalType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all the animals from all the the users',
    description: 'Get all the animals from all the users',
  })
  @Get()
  getAnimals(@Req() req: Request): Promise<AnimalType[]> {
    return this.AnimalService.getAnimals(req.url);
  }

  @ApiOkResponse({
    description: 'The Animal with id has been successfully retreived.',
    type: AnimalType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get an animal by id',
    description: 'Get an animal by users',
  })
  @Get(':id')
  getAnimalById(
    @Param('id') animalId: string,
    @Req() req: Request,
  ): Promise<AnimalType> {
    return this.AnimalService.getAnimalById(animalId, req.url);
  }

  @ApiOkResponse({
    description: 'The Animal with user_id has been successfully retreived.',
    type: AnimalType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get an animal by userid',
    description: 'Get all the absences from all the users',
  })
  @Get('/user/:user_id')
  getAnimalsByUserId(
    @Param('user_id') user_id: string,
    @Req() req: Request,
  ): Promise<AnimalDto[]> {
    return this.AnimalService.getAnimalsByUserId(user_id, req.url);
  }

  @ApiCreatedResponse({
    description: 'The Animal has been successfully created',
    type: AnimalType,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Create an animal',
    description: 'Create an animal',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createAnimal(
    @GetUser('id') userId: string,
    @Body() dto: AnimalDto,
  ): Promise<AnimalType> {
    return this.AnimalService.createAnimal(userId, dto);
  }

  @ApiOkResponse({
    description: 'The Animal has been successfully updated',
    type: AnimalType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update an animal',
    description: 'Update an animal',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updateAnimal(
    @GetUser('id') userId: string,
    @Param('id') animalId: string,
    @Body() dto: UpdateAnimalDto,
  ): Promise<AnimalType> {
    return this.AnimalService.updateAnimal(userId, animalId, dto);
  }

  @ApiOkResponse({
    description: 'The Animal has been successfully updated',
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Delete an animal',
    description: 'Delete an animal - user can only delete his own animals',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  deleteAnimal(@GetUser('id') userId: string, @Param('id') animalId: string) {
    return this.AnimalService.deleteAnimal(userId, animalId);
  }
}
