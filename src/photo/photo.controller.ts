import { PhotoDto } from './dto/Photo.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { PhotoService } from './photo.service';
import { UpdatePhotoDto } from './dto';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('photos')
@UseGuards(JwtGuard)
@Controller('photos')
export class PhotoController {
  constructor(private PhotoService: PhotoService) {}

  @ApiOkResponse({
    description: 'The photos have been successfully retreived',
    type: PhotoDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all photos from all users',
    description: 'Get all photos from all users',
  })
  @Get()
  getPhotos(@Req() req: Request): Promise<PhotoDto[]> {
    return this.PhotoService.getPhotos(req.url);
  }

  @ApiOkResponse({
    description: 'The photo has been successfully retreived',
    type: PhotoDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get a photo by id',
    description: 'Get a photo by id',
  })
  @Get(':id')
  getPhoto(
    @Param('id') photoId: string,
    @Req() req: Request,
  ): Promise<PhotoDto> {
    return this.PhotoService.getPhotoById(photoId, req.url);
  }

  @ApiOkResponse({
    description: 'The photos have been successfully retreived',
    type: PhotoDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get all photos related to a house using the houseid',
    description: 'Get all photos related to a house using the houseid',
  })
  @Get('/house/:house_id')
  getPhotoByHouseId(
    @Param('house_id') house_id: string,
    @Req() req: Request,
  ): Promise<PhotoDto[]> {
    return this.PhotoService.getPhotoByHouseId(house_id, req.url);
  }

  @ApiOkResponse({
    description: 'The photo has been successfully created',
    type: PhotoDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Create a new photo',
    description: 'Create a new photo',
  })
  @Post()
  createPhoto(
    @GetUser('id') userId: string,
    @Body() dto: PhotoDto,
  ): Promise<PhotoDto> {
    return this.PhotoService.createPhoto(userId, dto);
  }

  @ApiOkResponse({
    description: 'The photo has been successfully updated',
    type: PhotoDto,
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update a photo',
    description: 'Update a photo',
  })
  @Patch(':id')
  updatePhoto(
    @GetUser('id') userId: string,
    @Param('id') photoId: string,
    @Body() dto: UpdatePhotoDto,
  ): Promise<PhotoDto> {
    return this.PhotoService.updatePhoto(userId, photoId, dto);
  }

  @ApiOkResponse({
    description: 'The photo has been successfully deleted',
  })
  @ApiNotFoundResponse({ description: 'Ressources Not Found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Delete a photo',
    description: 'Delete a photo',
  })
  @Delete(':id')
  deletePhoto(@GetUser('id') userId: string, @Param('id') photoId: string) {
    return this.PhotoService.deletePhoto(userId, photoId);
  }
}
