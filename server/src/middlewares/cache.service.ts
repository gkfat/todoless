import Redis from 'ioredis';

import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
    private client: Redis;

    constructor(
        private readonly redisService: RedisService,
    ) {
        this.client = this.redisService.getOrThrow();
    }

    async setValue(key: string , value: string, ttl: string) {
        return await this.client.set(key, value, 'PX', ttl);
    }

    async getValue(key: string) {
        return await this.client.get(key);
    }

    async deleteValue(key: string) {
        return await this.client.del(key);
    }
}