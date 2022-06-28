import { AbsenceService } from './absence.service';
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
import { AbsenceDto, UpdateAbsenceDto } from './dto';
import { GetUser } from 'src/auth/decorator';
import { AbsenceType } from './types';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('absences')
export class AbsenceController {
  constructor(private AbsenceService: AbsenceService) {}

  @Get()
  getAbsences(@Req() req: Request): Promise<AbsenceType[]> {
    return this.AbsenceService.getAbsences(req.url);
  }

  @Get('/:id')
  getAbsenceById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AbsenceType> {
    return this.AbsenceService.getAbsenceById(id, req.url);
  }

  @Get('/user/:user_id')
  getAbsencesByUserId(
    @Param('user_id') user_id: string,
    @Req() req: Request,
  ): Promise<AbsenceType[]> {
    return this.AbsenceService.getAbsencesByUserId(user_id, req.url);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createAbsence(
    @GetUser('id') userId: string,
    @Body() dto: AbsenceDto,
  ): Promise<AbsenceType> {
    return this.AbsenceService.createAbsence(userId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updateAbsence(
    @GetUser('id') userId: string,
    @Param('id') absenceId: string,
    @Body() dto: UpdateAbsenceDto,
  ): Promise<AbsenceType> {
    return this.AbsenceService.updateAbsence(userId, absenceId, dto);
  }

  @Delete()
  deleteAbsence(@GetUser('id') userId: string, @Body() dto: AbsenceDto) {
    return this.AbsenceService.deleteAbsence(userId, dto);
  }
}
