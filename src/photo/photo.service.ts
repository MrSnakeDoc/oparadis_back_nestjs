import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PhotoDto } from './dto';

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

  async getPhotosById(photoId: string) {
    try {
      const photo = await this.prisma.photo.findFirst({
        where: {
          id: photoId,
        },
      });
      if (!photo) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }
      return photo;
    } catch (error) {
      throw error;
    }
  }

  async createPhoto(userId: string, dto: PhotoDto) {
    try {
      const photo = await this.prisma.photo.create({
        data: {
          ...dto,
          user_id: userId,
        },
      });
      return photo;
    } catch (error) {
      throw error;
    }
  }

  async updatePhoto(userId: string, photoId: string, dto: PhotoDto) {
    try {
      const photo = await this.prisma.photo.findUnique({
        where: { id: photoId },
      });

      if (!photo || photo.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      return this.prisma.photo.update({
        where: { id: photoId },
        data: { ...dto },
      });
    } catch (error) {
      throw error;
    }
  }

  async deletePhoto(userId, photoId) {
    try {
      const photo = await this.prisma.photo.findUnique({
        where: { id: photoId },
      });

      if (!photo || photo.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      await this.prisma.photo.delete({
        where: { id: photoId },
      });
    } catch (error) {
      throw error;
    }
  }
}
