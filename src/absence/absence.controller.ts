import { AbsenceService } from './absence.service';
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { Request } from 'express';

@UseGuards(JwtGuard)
@Controller('absences')
export class AbsenceController {
  constructor(private AbsenceService: AbsenceService) {}

  @Get()
  getAbsences(@Req() req: Request) {
    return this.AbsenceService.getAbsences(req.url);
  }

  @Get('/:id')
  getAbsenceById(@Param('id') id: string, @Req() req: Request) {
    return this.AbsenceService.getAbsenceById(id, req.url);
  }
}
