export interface RedisInfo {
  // server
  redis_version: string;
  redis_git_sha1: string;
  redis_mode: string;
  os: string;
  arch_bits: string;
  tcp_port: string;
  uptime_in_seconds: string;
  uptime_in_days: string;
  hz: string;
  executable: string;
  config_file: string;

  // clients
  connected_clients: string;
  blocked_clients: string;
  tracking_clients: string;
  clients_in_timeout_table: string;

  // memory
  used_memory: string;
  used_memory_human: string;
  used_memory_rss: string;
  used_memory_rss_human: string;
  used_memory_peak: string;
  used_memory_peak_human: string;
  used_memory_peak_perc: string;
  used_memory_overhead: string;
  used_memory_dataset: string;
  mem_fragmentation_ratio: string;
  mem_allocator: string;
  total_system_memory: string;
  total_system_memory_human: string;

  // stats
  total_connections_received: string;
  total_commands_processed: string;
  instantaneous_ops_per_sec: string;
  total_net_input_bytes: string;
  total_net_output_bytes: string;
  rejected_connections: string;
  expired_keys: string;
  evicted_keys: string;
  keyspace_hits: string;
  keyspace_misses: string;

  // replication
  role: string;
  connected_slaves: string;
  master_replid: string;
  master_repl_offset: string;

  // cpu
  used_cpu_sys: string;
  used_cpu_user: string;
  used_cpu_sys_children: string;
  used_cpu_user_children: string;

  // keyspace
  [key: `db${number}`]: string; // db0, db1, ...
}