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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('absences')
@UseGuards(JwtGuard)
@Controller('absences')
export class AbsenceController {
  constructor(private AbsenceService: AbsenceService) {}

  @ApiOkResponse({
    description: 'The Absences have been successfully retreived.',
    type: AbsenceType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all the absences from all the users',
    description: 'Get all the absences from all the users',
  })
  @Get()
  getAbsences(@Req() req: Request): Promise<AbsenceType[]> {
    return this.AbsenceService.getAbsences(req.url);
  }

  @ApiOkResponse({
    description: 'The Absence has been successfully retreived.',
    type: AbsenceType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get the absence by id',
    description: 'Get an absence by its id',
  })
  @Get('/:id')
  getAbsenceById(
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<AbsenceType> {
    return this.AbsenceService.getAbsenceById(id, req.url);
  }

  @ApiOkResponse({
    description:
      'The Absence has been successfully retreived according to a user id.',
    type: AbsenceType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get the absence by a user_id',
    description: 'Get an absence by its user_id',
  })
  @Get('/user/:user_id')
  getAbsencesByUserId(
    @Param('user_id') user_id: string,
    @Req() req: Request,
  ): Promise<AbsenceType[]> {
    return this.AbsenceService.getAbsencesByUserId(user_id, req.url);
  }

  @ApiCreatedResponse({
    description: 'The Absence has been successfully created',
    type: AbsenceType,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Create a new absence',
    description: 'Create a new absence',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createAbsence(
    @GetUser('id') userId: string,
    @Body() dto: AbsenceDto,
  ): Promise<AbsenceType> {
    return this.AbsenceService.createAbsence(userId, dto);
  }

  @ApiOkResponse({
    description: 'The Absence has been successfully updated',
    type: AbsenceType,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update an absence',
    description: 'Update an absence using its id.',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updateAbsence(
    @GetUser('id') userId: string,
    @Param('id') absenceId: string,
    @Body() dto: UpdateAbsenceDto,
  ): Promise<AbsenceType> {
    return this.AbsenceService.updateAbsence(userId, absenceId, dto);
  }

  @ApiOkResponse({
    description: 'The Absence has been successfully deleted.',
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Delete an absence',
    description: 'Delete an absence, a user can only delete his own absences.',
  })
  @Delete()
  deleteAbsence(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.AbsenceService.deleteAbsence(userId, id);
  }
}
