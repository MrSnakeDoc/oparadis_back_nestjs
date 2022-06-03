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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateHouseDto, UpdateHouseDto } from './dto';

@UseGuards(JwtGuard)
@Controller('houses')
export class HouseController {
  constructor(private HouseService: HouseService) {}

  @Get()
  getHouses(@GetUser('id') userId: string) {
    console.log(userId);

    return this.HouseService.getHouses();
  }

  @Get('four')
  getFour() {
    return this.HouseService.getFour();
  }

  @Get(':id')
  getHouseById(@Param('id') houseId: string) {
    return this.HouseService.getHouseById(houseId);
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
