import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

@Injectable()
export class CloudinaryService {
  private cloud_name: string;
  private readonly defaultAvatar: string =
    'https://res.cloudinary.com/oparadis/image/upload/v1659708883/avatars/wwfddypsyw4lmdeofpyh.jpg';
  private readonly defaultHouse: string =
    'https://res.cloudinary.com/oparadis/image/upload/v1659945202/houses/gaeyb6crf17lyzgmee1u.jpg';
  private readonly defaultAnimal: string =
    'https://res.cloudinary.com/oparadis/image/upload/v1659946719/animals/apgkiawsdslxcax0mduy.jpg';
  private readonly defaultPlant: string =
    'https://res.cloudinary.com/oparadis/image/upload/v1659946801/plants/m3qswosuyambay46vlts.jpg';

  constructor(config: ConfigService) {
    this.cloud_name = config.get('CLOUD_NAME');
  }

  private scale(url, folder) {
    try {
      if (folder === 'avatars') {
        return url
          .split(`https://res.cloudinary.com/${this.cloud_name}/image/upload/`)
          .splice(1, 1)
          .map(
            (k) =>
              `https://res.cloudinary.com/${this.cloud_name}/image/upload/w_200,h_200,c_fill,g_face,r_max/${k}`,
          )
          .join();
      } else {
        return url
          .split(`https://res.cloudinary.com/${this.cloud_name}/image/upload/`)
          .splice(1, 1)
          .map(
            (k) =>
              `https://res.cloudinary.com/${this.cloud_name}/image/upload/c_scale,w_800/${k}`,
          )
          .join();
      }
    } catch (error) {
      throw error;
    }
  }

  public async upload(file: string, folder?: string): Promise<string> {
    try {
      cloudinary.image(file);
      const { secure_url }: UploadApiResponse =
        await cloudinary.uploader.upload(file, {
          folder,
        });

      const photo: string = this.scale(secure_url, folder);

      if (!photo)
        throw new HttpException(
          'Could not decode base64',
          HttpStatus.EXPECTATION_FAILED,
        );

      return photo;
    } catch (error) {
      throw error;
    }
  }

  public async delete(url, prefix?) {
    try {
      switch (url) {
        case this.defaultAvatar ||
          this.defaultHouse ||
          this.defaultAnimal ||
          this.defaultPlant:
          return { result: 'ok' };

        default:
          const key = url.split('/')[url.split('/').length - 1].split('.')[0];

          const destroy = await cloudinary.uploader.destroy(`${prefix}${key}`);

          if (destroy.result !== 'ok')
            throw new HttpException(
              'error delete cloudinary img !',
              HttpStatus.EXPECTATION_FAILED,
            );
          return;
      }
    } catch (error) {
      throw error;
    }
  }

  private imgType(folder) {
    switch (folder) {
      case 'avatars':
        return this.defaultAvatar;

      case 'houses':
        return this.defaultHouse;

      case 'animals':
        return this.defaultAnimal;

      case 'plants':
        return this.defaultPlant;
    }
  }

  public async processImg(
    newPhoto: string,
    storedPhoto: string,
    urlPrefix: string,
    folder: string,
  ) {
    try {
      const defaultPhoto = this.imgType(folder);
      switch (newPhoto) {
        case null:
          const cloudDelet = await this.delete(storedPhoto, urlPrefix);
          if (cloudDelet.result !== 'ok')
            throw new HttpException(
              'error delete cloudinary img !',
              HttpStatus.EXPECTATION_FAILED,
            );

          return defaultPhoto;

        default:
          const cloudDelete = await this.delete(storedPhoto);
          if (cloudDelete.result !== 'ok')
            throw new HttpException(
              'error delete cloudinary img !',
              HttpStatus.EXPECTATION_FAILED,
            );
          return this.upload(newPhoto, folder);
      }
    } catch (error) {
      throw error;
    }
  }
}
