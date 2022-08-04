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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('animals')
@UseGuards(JwtGuard)
@Controller('animals')
export class AnimalController {
  constructor(private AnimalService: AnimalService) {}

  @Get()
  getAnimals(@Req() req: Request): Promise<AnimalType[]> {
    return this.AnimalService.getAnimals(req.url);
  }

  @Get(':id')
  getAnimalById(
    @Param('id') animalId: string,
    @Req() req: Request,
  ): Promise<AnimalType> {
    return this.AnimalService.getAnimalById(animalId, req.url);
  }

  @Get('/user/:user_id')
  getAnimalsByUserId(
    @Param('user_id') user_id: string,
    @Req() req: Request,
  ): Promise<AnimalDto[]> {
    return this.AnimalService.getAnimalsByUserId(user_id, req.url);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createAnimal(
    @GetUser('id') userId: string,
    @Body() dto: AnimalDto,
  ): Promise<AnimalType> {
    return this.AnimalService.createAnimal(userId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updateAnimal(
    @GetUser('id') userId: string,
    @Param('id') animalId: string,
    @Body() dto: UpdateAnimalDto,
  ): Promise<AnimalType> {
    return this.AnimalService.updateAnimal(userId, animalId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  deleteAnimal(@GetUser('id') userId: string, @Param('id') animalId: string) {
    return this.AnimalService.deleteAnimal(userId, animalId);
  }
}
