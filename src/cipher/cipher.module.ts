import { Module } from '@nestjs/common';
import { CipherService } from './cipher.service';

@Module({
  providers: [CipherService],
})
export class CipherModule {}
