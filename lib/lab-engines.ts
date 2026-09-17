export interface ProjectileResult { time: number; range: number; height: number }

export function projectile(velocity: number, angleDegrees: number, gravity: number): ProjectileResult {
  const radians = (angleDegrees * Math.PI) / 180;
  const vertical = velocity * Math.sin(radians);
  const time = (2 * vertical) / gravity;
  return {
    time: Math.max(0, time),
    range: Math.max(0, velocity * Math.cos(radians) * time),
    height: Math.max(0, (vertical * vertical) / (2 * gravity)),
  };
}

export interface SystemModel { apis: number; cache: boolean; replicas: number; queue: boolean }
export interface SystemMetrics { capacity: number; queue: number; latency: number; errors: number; overloaded: boolean }

const API_CAPACITY_PER_NODE = 250;
const DATABASE_BASE_CAPACITY = 500;
const REPLICA_READ_CAPACITY = 300;
const CACHED_DEMAND_RATIO = 0.35;
const QUEUED_EXCESS_RATIO = 0.7;
const QUEUED_ERROR_RATIO = 0.1;
const BASE_LATENCY_MS = 30;
const UTILIZATION_LATENCY_MS = 90;
const QUEUE_LATENCY_MS = 25;

export function systemMetrics(requestsPerSecond: number, model: SystemModel): SystemMetrics {
  const apiCapacity = model.apis * API_CAPACITY_PER_NODE;
  const databaseCapacity = DATABASE_BASE_CAPACITY + model.replicas * REPLICA_READ_CAPACITY;
  const effectiveDemand = model.cache ? requestsPerSecond * CACHED_DEMAND_RATIO : requestsPerSecond;
  const capacity = Math.min(apiCapacity, databaseCapacity);
  const excess = Math.max(0, effectiveDemand - capacity);
  const queued = model.queue ? Math.round(excess * QUEUED_EXCESS_RATIO) : 0;
  const errors = model.queue ? Math.round(excess * QUEUED_ERROR_RATIO) : excess;
  return { capacity, queue: queued, latency: BASE_LATENCY_MS + Math.round((effectiveDemand / Math.max(capacity, 1)) * UTILIZATION_LATENCY_MS) + (model.queue ? QUEUE_LATENCY_MS : 0), errors, overloaded: excess > 0 };
}
