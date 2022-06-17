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
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { PlantDto, UpdatePlantDto } from './dto';
import { PlantService } from './plant.service';

@UseGuards(JwtGuard)
@Controller('plants')
export class PlantController {
  constructor(private PlantService: PlantService) {}

  @Get()
  getPlants(@Req() req: Request) {
    return this.PlantService.getPlants(req.url);
  }

  @Get(':id')
  getPlantById(@Param('id') PlantId: string, @Req() req: Request) {
    return this.PlantService.getPlantById(PlantId, req.url);
  }

  @Get('/user/:user_id')
  getAnimalByUserId(@Param('user_id') user_id: string, @Req() req: Request) {
    return this.PlantService.getPlantByUserId(user_id, req.url);
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
