import type {
  TokenEndpointResponse,
  TokenEndpointResponseHelpers,
} from "openid-client";
import { redis } from "./redis";

const SESSION_PREFIX = "session:";
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;

export const createSession = async (
  sessionId: string,
  tokens: TokenEndpointResponse & TokenEndpointResponseHelpers,
): Promise<"OK" | null> => {
  const key = `${SESSION_PREFIX}${sessionId}`;

  return await redis.set(
    key,
    JSON.stringify(tokens),
    "EX",
    SESSION_EXPIRATION_SECONDS,
  );
};

export const verifySession = async (
  sessionId: string,
): Promise<(TokenEndpointResponse & TokenEndpointResponseHelpers) | null> => {
  const key = `${SESSION_PREFIX}${sessionId}`;

  const data = await redis.get(key);
  if (!data) {
    return null;
  }

  await redis.expire(key, SESSION_EXPIRATION_SECONDS);

  return JSON.parse(data);
};

export const revokeSession = async (sessionId: string) => {
  await redis.del(`${SESSION_PREFIX}${sessionId}`);
};
