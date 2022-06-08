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
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { PlantDto, UpdatePlantDto } from './dto';
import { PlantService } from './plant.service';

@UseGuards(JwtGuard)
@Controller('plants')
export class PlantController {
  constructor(private PlantService: PlantService) {}

  @Get()
  getPlants() {
    return this.PlantService.getPlants();
  }

  @Get(':id')
  getPlantById(@Param('id') PlantId: string) {
    return this.PlantService.getPlantById(PlantId);
  }

  @Get('/user/:user_id')
  getAnimalByUserId(@Param('user_id') user_id: string) {
    return this.PlantService.getPlantByUserId(user_id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createPlant(@GetUser('id') userId: string, @Body() dto: PlantDto) {
    return this.PlantService.createPlant(userId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updatePlant(
    @GetUser('id') userId: string,
    @Param('id') PlantId: string,
    @Body() dto: UpdatePlantDto,
  ) {
    return this.PlantService.updatePlant(userId, PlantId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  deletePlant(@GetUser('id') userId: string, @Param('id') PlantId: string) {
    return this.PlantService.deletePlant(userId, PlantId);
  }
}
