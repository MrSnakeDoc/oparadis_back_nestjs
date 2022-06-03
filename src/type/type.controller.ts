import { Controller, Get, Param } from '@nestjs/common';
import { TypeService } from './type.service';

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
