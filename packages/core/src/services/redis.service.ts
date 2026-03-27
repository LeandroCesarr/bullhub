import type { RedisClient } from "../clients/redis.client";
import { BullhubRedis } from "../models/BullhubRedis";

export class RedisService {
  constructor(private readonly client: RedisClient) {}

  async info(): Promise<BullhubRedis> {
    const raw = await this.client.connection.info();
    return BullhubRedis.fromRedis(raw, this.client.connection.options);
  }
}
