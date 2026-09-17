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

export function systemMetrics(requestsPerSecond: number, model: SystemModel): SystemMetrics {
  const apiCapacity = model.apis * 250;
  const databaseCapacity = 500 + model.replicas * 300;
  const effectiveDemand = model.cache ? requestsPerSecond * 0.35 : requestsPerSecond;
  const capacity = Math.min(apiCapacity, databaseCapacity);
  const excess = Math.max(0, effectiveDemand - capacity);
  const queued = model.queue ? Math.round(excess * 0.7) : 0;
  const errors = model.queue ? Math.round(excess * 0.1) : excess;
  return { capacity, queue: queued, latency: 30 + Math.round((effectiveDemand / Math.max(capacity, 1)) * 90) + (model.queue ? 25 : 0), errors, overloaded: excess > 0 };
}
