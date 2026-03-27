import type { RedisOptions } from "ioredis";

interface RedisMemoryInfo {
  usedMemory: number;
  usedMemoryHuman: string;
  totalSystemMemory: number;
  totalSystemMemoryHuman: string;
  usedMemoryPeak: number;
  usedMemoryPeakHuman: string;
}

interface RedisStats {
  opsPerSec: number;
  totalCommands: number;
}

type RedisMode = "standalone" | "cluster" | "sentinel";

interface RedisServerInfo {
  host: string;
  port: number;
  mode: RedisMode;
  startedAt: number;
  clients: number;
}

export class BullhubRedis {
  private constructor(
      readonly memory: RedisMemoryInfo,
      readonly server: RedisServerInfo,
      readonly stats: RedisStats,
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
        },
        {
          opsPerSec: Number(parsed.instantaneous_ops_per_sec ?? 0),
          totalCommands: Number(parsed.total_commands_processed ?? 0),
        },
    );
  }

  private static uptimeToEpoch(uptimeSeconds: number): number {
    if (!Number.isFinite(uptimeSeconds) || uptimeSeconds < 0) {
      throw new Error("Invalid uptime");
    }

    return Date.now() - uptimeSeconds * 1000;
  }

  private static parseInfo(info: string): Record<string, string> {
    const result: Record<string, string> = {};

    for (const line of info.split("\n")) {
      if (!line || line.startsWith("#")) continue;

      const [key, value] = line.split(":");
      if (key && value) {
        result[key.trim()] = value.trim();
      }
    }

    return result;
  }
}