import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../auth/guard';
import { TypeService } from './type.service';
import { Type } from './types';

@ApiBearerAuth()
@ApiTags('types')
@UseGuards(JwtGuard)
@Controller('types')
export class TypeController {
  constructor(private TypeService: TypeService) {}

  @ApiOkResponse({
    description: 'All types have been successfully retreived',
    type: Type,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all types',
    description: 'Get all types',
  })
  @Get()
  getTypes(@Req() req: Request): Promise<Type[]> {
    return this.TypeService.getTypes(req.url);
  }

  @ApiOkResponse({
    description: 'The Type has been successfully retreived',
    type: Type,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get a type by id',
    description: 'Get a type by id',
  })
  @Get(':id')
  getTypesById(
    @Param('id') typeId: string,
    @Req() req: Request,
  ): Promise<Type> {
    return this.TypeService.getTypesById(typeId, req.url);
  }
}
