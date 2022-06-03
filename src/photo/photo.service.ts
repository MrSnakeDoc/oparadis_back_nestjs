import { PhotoDto } from './dto/Photo.dto';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PhotoService {
  constructor(private prisma: PrismaService) {}

  async getPhotos() {
    try {
      const photos = await this.prisma.photo.findMany();
      if (!photos) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }
      return photos;
    } catch (error) {
      throw error;
    }
  }

  async getPhotoById(id: string) {
    try {
      const photo: PhotoDto = await this.prisma.photo.findFirst({
        where: {
          id,
        },
      });
      if (!photo) {
        throw new HttpException('No photo found', HttpStatus.NOT_FOUND);
      }
      return photo;
    } catch (error) {
      throw error;
    }
  }

  async getPhotoByUserId(user_id: string) {
    try {
      const photos: PhotoDto[] = await this.prisma.photo.findMany({
        where: {
          user_id,
        },
      });
      if (!photos) {
        throw new HttpException('No photo found', HttpStatus.NOT_FOUND);
      }
      return photos;
    } catch (error) {
      throw error;
    }
  }

  async createPhoto(userId: string, photo: PhotoDto) {
    try {
      const newPhoto = await this.prisma.photo.create({
        data: {
          user_id: userId,
          ...photo,
        },
      });

      if (!newPhoto) {
        throw new HttpException('Photo not created', HttpStatus.BAD_REQUEST);
      }

      return newPhoto;
    } catch (error) {
      throw error;
    }
  }

  async updatePhoto(userId: string, id: string, dto: PhotoDto) {
    try {
      const photo = await this.prisma.photo.findUnique({
        where: { id },
      });

      if (!photo || photo.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      const updatedPhoto = await this.prisma.photo.update({
        where: {
          id,
        },
        data: {
          ...dto,
        },
      });

      if (!updatedPhoto)
        throw new HttpException('Photo not updated', HttpStatus.BAD_REQUEST);

      return updatedPhoto;
    } catch (error) {
      throw error;
    }
  }

  async deletePhoto(userId: string, id: string) {
    try {
      const photo = await this.prisma.photo.findUnique({
        where: { id },
      });

      if (!photo || photo.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      const deletedPhoto = await this.prisma.photo.delete({
        where: {
          id,
        },
      });

      if (!deletedPhoto) {
        throw new HttpException('Photo not deleted', HttpStatus.BAD_REQUEST);
      }

      return deletedPhoto;
    } catch (error) {
      throw error;
    }
  }
}
