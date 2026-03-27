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
  readonly memory: RedisMemoryInfo;
  readonly server: RedisServerInfo;
}
