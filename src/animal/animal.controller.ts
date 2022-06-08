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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { AnimalDto, UpdateAnimalDto } from './dto';

@UseGuards(JwtGuard)
@Controller('animals')
export class AnimalController {
  constructor(private AnimalService: AnimalService) {}

  @Get()
  getAnimals() {
    return this.AnimalService.getAnimals();
  }

  @Get(':id')
  getAnimalById(@Param('id') animalId: string) {
    return this.AnimalService.getAnimalById(animalId);
  }

  @Get('/user/:user_id')
  getAnimalByUserId(@Param('user_id') user_id: string) {
    return this.AnimalService.getAnimalByUserId(user_id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createAnimal(@GetUser('id') userId: string, @Body() dto: AnimalDto) {
    return this.AnimalService.createAnimal(userId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updateAnimal(
    @GetUser('id') userId: string,
    @Param('id') animalId: string,
    @Body() dto: UpdateAnimalDto,
  ) {
    return this.AnimalService.updateAnimal(userId, animalId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  deleteAnimal(@GetUser('id') userId: string, @Param('id') animalId: string) {
    return this.AnimalService.deleteAnimal(userId, animalId);
  }
}
