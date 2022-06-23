import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

@Injectable()
export class CloudinaryService {
  private cloud_name: string;
  constructor(config: ConfigService) {
    this.cloud_name = config.get('CLOUD_NAME');
  }

  async upload(file: string, folder?: string): Promise<string> {
    try {
      cloudinary.image(file);
      const { secure_url }: UploadApiResponse =
        await cloudinary.uploader.upload(file, {
          folder,
        });
      return secure_url
        .split(`https://res.cloudinary.com/${this.cloud_name}/image/upload/`)
        .splice(1, 1)
        .map(
          (k) =>
            `https://res.cloudinary.com/${this.cloud_name}/image/upload/c_scale,w_800/${k}`,
        )
        .join();
    } catch (error) {
      console.log(error);
    }
  }

  async avatar(file: string, folder: string): Promise<string> {
    cloudinary.image(file);

    const { secure_url } = await cloudinary.uploader.upload(file, { folder });
    return secure_url
      .split(`https://res.cloudinary.com/${this.cloud_name}/image/upload/`)
      .splice(1, 1)
      .map(
        (k) =>
          `https://res.cloudinary.com/${this.cloud_name}/image/upload/w_200,h_200,c_fill,g_face,r_max/${k}`,
      )
      .join();
  }

  async delete(url, prefix?) {
    try {
      const key = url.split('/')[url.split('/').length - 1].split('.')[0];
      return await cloudinary.uploader.destroy(`${prefix}${key}`);
    } catch (error) {
      console.log(error);
    }
  }
}
