import { ConfigService } from '@nestjs/config';
import { PhotoDto } from './dto/Photo.dto';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePhotoDto } from './dto';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class PhotoService {
  private readonly prefix: string = 'photos:';
  private readonly folder: string = 'houses';
  private readonly urlPrefix: string = 'houses/';

  constructor(
    private prisma: PrismaService,
    private cache: RedisCacheService,
    private cloudinary: CloudinaryService,
    private readonly configService: ConfigService,
  ) {}

  async getPhotos(url: string): Promise<PhotoDto[]> {
    try {
      const cachedPhotos: PhotoDto[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedPhotos) return cachedPhotos;

      const photos = await this.prisma.photo.findMany();
      if (!photos) {
        throw new HttpException('No houses found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        photos,
        this.configService.get('CACHE_TTL'),
      );

      return photos;
    } catch (error) {
      throw error;
    }
  }

  async getPhotoById(id: string, url: string): Promise<PhotoDto> {
    try {
      const cachedPhoto: PhotoDto = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedPhoto) return cachedPhoto;

      const photo: PhotoDto = await this.prisma.photo.findFirst({
        where: {
          id,
        },
      });
      if (!photo) {
        throw new HttpException('No photo found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        photo,
        this.configService.get('CACHE_TTL'),
      );

      return photo;
    } catch (error) {
      throw error;
    }
  }

  async getPhotoByHouseId(house_id: string, url: string): Promise<PhotoDto[]> {
    try {
      const cachedPhotos: PhotoDto[] = await this.cache.get(
        `${this.prefix}${url}`,
      );

      if (cachedPhotos) return cachedPhotos;

      const photos: PhotoDto[] = await this.prisma.photo.findMany({
        where: {
          house_id,
        },
      });

      if (!photos) {
        throw new HttpException('No photo found', HttpStatus.NOT_FOUND);
      }

      await this.cache.set(
        `${this.prefix}${url}`,
        photos,
        this.configService.get('CACHE_TTL'),
      );

      return photos;
    } catch (error) {
      throw error;
    }
  }

  async createPhoto(user_id: string, dto: PhotoDto): Promise<PhotoDto> {
    try {
      const photo: PhotoDto = {
        ...dto,
        photo: await this.cloudinary.upload(dto.photo, this.folder),
      };

      if (!photo.photo)
        throw new HttpException(
          'Could not decode base64',
          HttpStatus.EXPECTATION_FAILED,
        );

      const newPhoto = await this.prisma.photo.create({
        data: {
          user_id,
          ...photo,
        },
      });

      if (!newPhoto) {
        throw new HttpException('Photo not created', HttpStatus.BAD_REQUEST);
      }

      await this.cache.del(this.prefix);

      return newPhoto;
    } catch (error) {
      throw error;
    }
  }

  async updatePhoto(
    userId: string,
    id: string,
    dto: UpdatePhotoDto,
  ): Promise<PhotoDto> {
    try {
      const storedPhoto = await this.prisma.photo.findUnique({
        where: { id },
      });

      if (!storedPhoto || storedPhoto.user_id !== userId)
        throw new ForbiddenException('Access to ressources denied');

      const cloudDelete = await this.cloudinary.delete(
        storedPhoto.photo,
        this.urlPrefix,
      );

      if (cloudDelete.result !== 'ok')
        throw new HttpException(
          'error delete cloudinary img !',
          HttpStatus.EXPECTATION_FAILED,
        );

      const photo: string = await this.cloudinary.upload(
        dto.photo,
        this.folder,
      );

      if (!photo) throw new Error('Could not decode base64');

      const data: UpdatePhotoDto = {
        ...dto,
        photo,
      };

      const updatedPhoto = await this.prisma.photo.update({
        where: {
          id,
        },
        data: {
          ...data,
        },
      });

      if (!updatedPhoto)
        throw new HttpException('Photo not updated', HttpStatus.BAD_REQUEST);

      await this.cache.del(this.prefix);

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

      const cloudDelete = await this.cloudinary.delete(
        photo.photo,
        this.urlPrefix,
      );

      if (cloudDelete.result !== 'ok')
        throw new HttpException(
          'error delete cloudinary img !',
          HttpStatus.EXPECTATION_FAILED,
        );

      await this.prisma.photo.delete({
        where: {
          id,
        },
      });

      await this.cache.del(this.prefix);

      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }
}
