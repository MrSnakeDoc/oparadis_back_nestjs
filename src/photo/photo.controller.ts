import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { PhotoDto } from './dto';
import { PhotoService } from './photo.service';

UseGuards(JwtGuard);
@Controller('photo')
export class PhotoController {
  constructor(private PhotoService: PhotoService) {}

  @Get()
  getPhotos() {
    return this.PhotoService.getPhotos();
  }

  @Get(':id')
  getPhotosById(@Param('id') photoId: string) {
    return this.PhotoService.getPhotosById(photoId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  createPhoto(@GetUser('id') userId: string, @Body() dto: PhotoDto) {
    return this.PhotoService.createPhoto(userId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':id')
  updatePhoto(
    @GetUser('id') userId: string,
    @Param('id') photoId: string,
    @Body() dto: PhotoDto,
  ) {
    return this.PhotoService.updatePhoto(userId, photoId, dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  deletePhoto(@GetUser('id') userId: string, @Param('id') photoId: string) {
    return this.PhotoService.deletePhoto(userId, photoId);
  }
}
