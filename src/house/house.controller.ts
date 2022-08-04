import { HouseService } from './house.service';
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
import { CreateHouseDto, UpdateHouseDto } from './dto';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('houses')
@UseGuards(JwtGuard)
@Controller('houses')
export class HouseController {
  constructor(private HouseService: HouseService) {}

  @Get('/full')
  getHousesFull(@Req() req: Request) {
    return this.HouseService.getHousesFull(req.url);
  }

  @Get('/full/:id')
  getHouseFullById(@Param('id') id: string, @Req() req: Request) {
    return this.HouseService.getHouseFullById(id, req.url);
  }

  @Get(':id')
  getHouseById(@Param('id') houseId: string, @Req() req: Request) {
    return this.HouseService.getHouseById(houseId, req.url);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createHouse(@GetUser('id') userId: string, @Body() dto: CreateHouseDto) {
    return this.HouseService.createHouse(userId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updateHouse(
    @GetUser('id') userId: string,
    @Param('id') houseId: string,
    @Body() dto: UpdateHouseDto,
  ) {
    return this.HouseService.updateHouse(userId, houseId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  deleteHouse(@GetUser('id') userId: string, @Param('id') houseId: string) {
    return this.HouseService.deleteHouse(userId, houseId);
  }
}
