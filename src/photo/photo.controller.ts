import { PhotoDto } from './dto/Photo.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { PhotoService } from './photo.service';
import { UpdatePhotoDto } from './dto';

@UseGuards(JwtGuard)
@Controller('photos')
export class PhotoController {
  constructor(private PhotoService: PhotoService) {}

  @Get()
  getPhotos(@GetUser('id') userId: string) {
    return this.PhotoService.getPhotos();
  }

  @Get(':id')
  getPhoto(@Param('id') photoId: string) {
    return this.PhotoService.getPhotoById(photoId);
  }

  @Get('/house/:houseId')
  getPhotoByHouseId(@Param('userId') userId: string) {
    return this.PhotoService.getPhotoByHouseId(userId);
  }

  @Post()
  createPhoto(@GetUser('id') userId: string, @Body() dto: PhotoDto) {
    return this.PhotoService.createPhoto(userId, dto);
  }

  @Patch(':id')
  updatePhoto(
    @GetUser('id') userId: string,
    @Param('id') photoId: string,
    @Body() dto: UpdatePhotoDto,
  ) {
    return this.PhotoService.updatePhoto(userId, photoId, dto);
  }

  @Delete(':id')
  deletePhoto(@GetUser('id') userId: string, @Param('id') photoId: string) {
    return this.PhotoService.deletePhoto(userId, photoId);
  }
}
