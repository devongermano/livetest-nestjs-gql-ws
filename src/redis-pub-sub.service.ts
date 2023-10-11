import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Injectable()
export class RedisPubSubService extends RedisPubSub implements OnModuleInit {
  constructor() {
    super({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        username: process.env.REDIS_USERNAME || undefined,
        password: process.env.REDIS_PASSWORD || undefined,
        db: Number(process.env.REDIS_DATABASE) || 0,
      },
    });
  }

  async onModuleInit() {
    // Any initialization code can be placed here
  }
}
