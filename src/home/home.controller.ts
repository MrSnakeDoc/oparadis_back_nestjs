import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { HouseType } from 'src/house/types';
import { HomeService } from './home.service';

@ApiTags('home')
@Controller()
export class HomeController {
  constructor(private homeService: HomeService) {}

  @Get()
  getFour(@Req() req: Request): Promise<HouseType[]> {
    return this.homeService.getFour(req.url);
  }

  @Get('/houses')
  getHouses(@Req() req: Request): Promise<HouseType[]> {
    return this.homeService.getHouses(req.url);
  }
}
