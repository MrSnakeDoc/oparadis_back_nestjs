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
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { MatchDto, MatchFullDto } from './dto/';
import { ValidateMatchDto } from './dto/validateMatch.dto';
import { MatchService } from './match.service';

@ApiBearerAuth()
@ApiTags('matches')
@UseGuards(JwtGuard)
@Controller('matches')
export class MatchController {
  constructor(private MatchService: MatchService) {}

  @ApiOkResponse({
    description: 'All matches have been successfully retreived',
    type: MatchFullDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all matches of all users',
    description: 'Get all matches of all users',
  })
  @Get()
  getMatches(@Req() req: Request): Promise<MatchDto[]> {
    return this.MatchService.getMatches(req.url);
  }

  @ApiOkResponse({
    description: 'The match has been successfully retreived',
    type: MatchFullDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get a match by id',
    description: 'Get a match by id',
  })
  @Get(':id')
  getMatchById(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<MatchFullDto> {
    return this.MatchService.getMatchById(userId, id, req.url);
  }

  @ApiOkResponse({
    description: 'The match has been successfully retreived',
    type: MatchFullDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get a match by userid',
    description: 'Get a match by userid',
  })
  @Get(':userId')
  getMatchByUserId(
    @Param('userId') userId: string,
    @Req() req: Request,
  ): Promise<MatchDto[]> {
    return this.MatchService.getMatchByUserId(userId, req.url);
  }

  @ApiOkResponse({
    description: 'The matches have been successfully retreived',
    type: MatchFullDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all matches belonging to a user',
    description: 'Get all matches belonging to a user',
  })
  @Get(':userId')
  getMatchByAbsenceId(
    @Param('userId') absenceId: string,
    @Req() req: Request,
  ): Promise<MatchDto[]> {
    return this.MatchService.getMatchByAbsenceId(absenceId, req.url);
  }

  @ApiOkResponse({
    description: 'The match has been fully created',
    type: MatchFullDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Create a new match',
    description: 'Create a new match',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  saveMatch(
    @GetUser('id') userId: string,
    @Body() dto: MatchDto,
  ): Promise<MatchDto> {
    return this.MatchService.saveMatch(userId, dto);
  }

  @ApiOkResponse({
    description: `The match has been successfully updated`,
    type: MatchFullDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update a match',
    description: 'Update a match',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updateMatch(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: MatchDto,
  ): Promise<MatchDto> {
    return this.MatchService.updateMatch(userId, id, dto);
  }

  @ApiOkResponse({
    description: 'The match has been validated',
    type: MatchFullDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Validate a match',
    description:
      "Validate a match, only the absence's owner can validate a match",
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('validate/:id')
  validateMatch(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: ValidateMatchDto,
  ): Promise<MatchFullDto> {
    return this.MatchService.validateMatch(userId, id, dto);
  }

  @ApiOkResponse({
    description: 'The match has been successfully deleted',
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Delete a match',
    description: 'Delete a match',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  deleteMatch(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.MatchService.deleteMatch(userId, id);
  }
}
