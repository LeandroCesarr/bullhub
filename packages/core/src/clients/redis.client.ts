import Redis from 'ioredis';
import type { RedisOptions } from 'ioredis';
import type {BullhubOptions} from "../types/bullhub";

export class RedisClient {
  public readonly connection: Redis;

  constructor(opts: BullhubOptions) {
    this.connection = new Redis(opts.connection as RedisOptions)
  }

  async close(): Promise<void> {
    await this.connection.quit()
  }
}