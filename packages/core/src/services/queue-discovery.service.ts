import type { RedisClient } from "../clients/redis.client";
import type { BullhubOptionsQueue } from "../types/bullhub";

export class QueueDiscoveryService {
  constructor(private readonly redisClient: RedisClient) {}

  async discover(prefix: string): Promise<BullhubOptionsQueue[]> {
    const pattern = `${prefix}:*:id`;
    const keys = await this.scanAll(pattern);
    const names = keys.map((key) => this.extractQueueName(key, prefix));
    return names.map((name) => ({ name, prefix }));
  }

  private async scanAll(pattern: string): Promise<string[]> {
    const keys: string[] = [];
    let cursor = "0";

    do {
      const [nextCursor, batch] = await this.redisClient.connection.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100,
      );
      cursor = nextCursor;
      keys.push(...batch);
    } while (cursor !== "0");

    return keys;
  }

  private extractQueueName(key: string, prefix: string): string {
    const withoutPrefix = key.slice(prefix.length + 1);
    return withoutPrefix.slice(0, withoutPrefix.lastIndexOf(":"));
  }
}
