import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guard';
import { TypeService } from './type.service';
import { Type } from './types';

@UseGuards(JwtGuard)
@Controller('types')
export class TypeController {
  constructor(private TypeService: TypeService) {}

  @Get()
  getTypes(@Req() req: Request): Promise<Type[]> {
    return this.TypeService.getTypes(req.url);
  }

  @Get(':id')
  getCountriesById(
    @Param('id') typeId: string,
    @Req() req: Request,
  ): Promise<Type> {
    return this.TypeService.getTypesById(typeId, req.url);
  }
}
