import { Module } from '@nestjs/common';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';

@Module({
  controllers: [TypeController],
  providers: [TypeService]
})
export class TypeModule {}
