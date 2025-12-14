import Redis, { type RedisOptions } from "ioredis";

const globalForRedis = global as unknown as { redis: Redis | undefined };

const getRedisOptions = (): RedisOptions => {
  if (process.env.REDIS_URL) {
    return {
      lazyConnect: true,
    };
  }

  const options: RedisOptions = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    lazyConnect: true,
  };

  if (process.env.REDIS_PASSWORD) {
    options.password = process.env.REDIS_PASSWORD;
    if (process.env.REDIS_USERNAME) {
      options.username = process.env.REDIS_USERNAME;
    }
  }

  if (process.env.REDIS_USE_TLS === "true") {
    options.tls = {};
  }

  return options;
};

export const redis =
  globalForRedis.redis ??
  (process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL, getRedisOptions())
    : new Redis(getRedisOptions()));

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
