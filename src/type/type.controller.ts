import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { TypeService } from './type.service';

@UseGuards(JwtGuard)
@Controller('types')
export class TypeController {
  constructor(private TypeService: TypeService) {}

  @Get()
  getTypes() {
    return this.TypeService.getTypes();
  }

  @Get(':id')
  getCountriesById(@Param('id') typeId: string) {
    return this.TypeService.getTypesById(typeId);
  }
}
