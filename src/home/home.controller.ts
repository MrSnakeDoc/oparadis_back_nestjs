import { Controller, Get, HttpCode, Req, HttpStatus } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { HouseType } from '../house/types';
import { HomeService } from './home.service';

@ApiTags('home')
@Controller()
export class HomeController {
  constructor(
    private homeService: HomeService,
    private prisma: PrismaService,
  ) {}

  @ApiOkResponse({
    description: 'The last houses have been successfully retreived.',
    type: HouseType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiOperation({
    summary: 'Get the four last houses registered',
    description:
      'Get the four last houses registered to display on the home route',
  })
  @Get()
  getFour(@Req() req: Request): Promise<HouseType[]> {
    return this.homeService.getFour(req.url);
  }

  @ApiOkResponse({
    description: 'The houses have been successfully retreived.',
    type: HouseType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiOperation({
    summary: 'Get all the houses registered',
    description: 'Get all the houses registered to display on the search page',
  })
  @Get('/houses')
  getHouses(@Req() req: Request): Promise<HouseType[]> {
    return this.homeService.getHouses(req.url);
  }

  @Get('/reset')
  async reset() {
    await this.prisma.resetUsers();
    return HttpCode(HttpStatus.OK);
  }
}
