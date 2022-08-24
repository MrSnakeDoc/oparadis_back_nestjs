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
  HttpStatus,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { AbsenceDto, UpdateAbsenceDto, CreateAbsenceDto } from './dto';
import { GetUser } from '../auth/decorator';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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
    type: AbsenceDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all the absences from all the users',
    description: 'Get all the absences from all the users',
  })
  @Get()
  getAbsences(@Req() req: Request): Promise<AbsenceDto[]> {
    return this.AbsenceService.getAbsences(req.url);
  }

  @ApiOkResponse({
    description: 'The Absence has been successfully retreived.',
    type: AbsenceDto,
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
  ): Promise<AbsenceDto> {
    return this.AbsenceService.getAbsenceById(id, req.url);
  }

  @ApiOkResponse({
    description:
      'The Absence has been successfully retreived according to a user id.',
    type: AbsenceDto,
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
  ): Promise<AbsenceDto[]> {
    return this.AbsenceService.getAbsencesByUserId(user_id, req.url);
  }

  @ApiCreatedResponse({
    description: 'The Absence has been successfully created',
    type: AbsenceDto,
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
    @Body() dto: CreateAbsenceDto,
  ): Promise<AbsenceDto> {
    return this.AbsenceService.createAbsence(userId, dto);
  }

  @ApiOkResponse({
    description: 'The Absence has been successfully updated',
    type: AbsenceDto,
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
  ): Promise<AbsenceDto> {
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
  deleteAbsence(
    @GetUser('id') userId: string,
    @Param('id') id: string,
  ): Promise<HttpStatus> {
    return this.AbsenceService.deleteAbsence(userId, id);
  }
}
