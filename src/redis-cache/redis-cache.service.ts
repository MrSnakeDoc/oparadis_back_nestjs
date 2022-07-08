import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
  async get(key: string): Promise<any> {
    return await this.cache.get(key);
  }

  async set(key: string, value: any, ttl?: number) {
    ttl
      ? await this.cache.set(key, value, { ttl })
      : await this.cache.set(key, value);
  }

  async reset() {
    await this.cache.reset();
  }

  async del(prefix: string) {
    const keys: string[] = await this.cache.store.keys();

    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        this.cache.del(key);
      }
    });
  }
}
