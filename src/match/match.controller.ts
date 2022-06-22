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
import { Request } from 'express';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { MatchDto } from './dto/';
import { MatchService } from './match.service';

@UseGuards(JwtGuard)
@Controller('matches')
export class MatchController {
  constructor(private MatchService: MatchService) {}

  // @Get()
  // getMatches(@Req() req: Request): MatchDto[] {
  //   return this.MatchService.getMatches(req.url);
  // }

  // @Get(':id')
  // getMatchById(@Param('id') id: string, @Req() req: Request): MatchDto {
  //   return this.MatchService.getMatchById(id, req.url);
  // }

  // @Get(':userId')
  // getMatchByUserId(
  //   @Param('userId') userId: string,
  //   @Req() req: Request,
  // ): MatchDto[] {
  //   return this.MatchService.getMatchByUserId(userId, req.url);
  // }

  // @Get(':userId')
  // getMatchBySitterId(
  //   @Param('userId') sitterId: string,
  //   @Req() req: Request,
  // ): MatchDto[] {
  //   return this.MatchService.getMatchBySitterId(sitterId, req.url);
  // }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Post()
  // saveMatch(@GetUser('id') userId: string, @Body() dto: MatchDto): MatchDto {
  //   return this.MatchService.saveMatch(userId, dto);
  // }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Patch(':id')
  // updateMatch(
  //   @GetUser('id') userId: string,
  //   @Param('id') id: string,
  //   @Body() dto: MatchDto,
  // ): MatchDto {
  //   return this.MatchService.updateMatch(id, dto);
  // }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Delete(':id')
  // deleteMatch(@GetUser('id') userId: string, @Param('id') id: string) {
  //   return this.MatchService.deleteMatch(userId, id);
  // }
}
