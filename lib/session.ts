import { TimeUnit, type GlideString } from "@valkey/valkey-glide";
import type {
  TokenEndpointResponse,
  TokenEndpointResponseHelpers,
} from "openid-client";
import { getValkeyClient } from "./valkey";

const SESSION_PREFIX = "session:";
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;

export const createSession = async (
  sessionId: string,
  tokens: TokenEndpointResponse & TokenEndpointResponseHelpers,
): Promise<"OK" | GlideString | null> => {
  const key = `${SESSION_PREFIX}${sessionId}`;
  const client = await getValkeyClient();

  return await client.set(key, JSON.stringify(tokens), {
    expiry: { type: TimeUnit.Seconds, count: SESSION_EXPIRATION_SECONDS },
  });
};

export const verifySession = async (
  sessionId: string,
): Promise<(TokenEndpointResponse & TokenEndpointResponseHelpers) | null> => {
  const key = `${SESSION_PREFIX}${sessionId}`;
  const client = await getValkeyClient();

  const data = await client.get(key);
  if (!data) {
    return null;
  }

  await client.expire(key, SESSION_EXPIRATION_SECONDS);

  return JSON.parse(data.toString());
};

export const revokeSession = async (sessionId: string) => {
  const client = await getValkeyClient();
  await client.del([`${SESSION_PREFIX}${sessionId}`]);
};
