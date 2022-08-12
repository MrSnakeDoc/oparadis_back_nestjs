import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto-js';

@Injectable()
export class CipherService {
  constructor(private readonly configService: ConfigService) {}

  encrypt(jwt): string {
    return crypto.AES.encrypt(
      jwt,
      this.configService.get('ENCRYPTION_KEY'),
    ).toString();
  }

  decrypt(ciphertext) {
    return crypto.AES.decrypt(
      ciphertext,
      this.configService.get('ENCRYPTION_KEY'),
    ).toString(crypto.enc.Utf8);
  }
}
