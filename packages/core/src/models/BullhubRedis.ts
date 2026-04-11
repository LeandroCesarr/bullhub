import type { RedisOptions } from "ioredis";
import {RedisInfo} from "../types/redis";

interface RedisMemoryInfo {
  usedMemory: number;
  usedMemoryHuman: string;
  totalSystemMemory: number;
  totalSystemMemoryHuman: string;
  usedMemoryPeak: number;
  usedMemoryPeakHuman: string;
}
type RedisMode = "standalone" | "cluster" | "sentinel";

interface RedisServerInfo {
  host: string;
  port: number;
  mode: RedisMode;
  startedAt: number;
  clients: number;
  version: string;
}

export class BullhubRedis {
  private constructor(
      readonly memory: RedisMemoryInfo,
      readonly server: RedisServerInfo,
  ) {}

  static fromRedis(raw: string, opts: RedisOptions): BullhubRedis {
    const parsed = this.parseInfo(raw);

    return new BullhubRedis(
        {
          usedMemory: Number(parsed.used_memory),
          usedMemoryHuman: parsed.used_memory_human,
          totalSystemMemory: Number(parsed.total_system_memory),
          totalSystemMemoryHuman: parsed.total_system_memory_human,
          usedMemoryPeak: Number(parsed.used_memory_peak),
          usedMemoryPeakHuman: parsed.used_memory_peak_human,
        },
        {
          host: opts.host ?? "unknown",
          port: opts.port ?? 0,
          mode: (parsed.redis_mode as RedisMode) ?? "standalone",
          startedAt: this.uptimeToEpoch(
              Number(parsed.uptime_in_seconds ?? 0),
          ),
          clients: Number(parsed.connected_clients ?? 0),
          version: parsed.redis_version ?? "unknown",
        }
    );
  }

  private static uptimeToEpoch(uptimeSeconds: number): number {
    if (!Number.isFinite(uptimeSeconds) || uptimeSeconds < 0) {
      throw new Error("Invalid uptime");
    }

    return Date.now() - uptimeSeconds * 1000;
  }

  private static parseInfo(info: string): RedisInfo {
    const result: Record<string, string> = {};

    for (const line of info.split("\n")) {
      if (!line || line.startsWith("#")) continue;

      const [key, value] = line.split(":");
      if (key && value) {
        result[key.trim()] = value.trim();
      }
    }

    return result as unknown as RedisInfo;
  }
}