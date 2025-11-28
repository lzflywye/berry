import { GlideClient, type GlideString, TimeUnit } from "@valkey/valkey-glide";
import type {
  TokenEndpointResponse,
  TokenEndpointResponseHelpers,
} from "openid-client";

const storeClient = await GlideClient.createClient({
  addresses: [
    { host: process.env.VALKEY_URL!, port: Number(process.env.VALKEY_PORT!) },
  ],
  useTLS: false,
  requestTimeout: 5000,
});

const SESSION_PREFIX = "session:";
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7日間

export const saveSession = async (
  sessionId: string,
  tokens: TokenEndpointResponse & TokenEndpointResponseHelpers,
): Promise<"OK" | GlideString | null> => {
  const key = `${SESSION_PREFIX}${sessionId}`;

  return await storeClient.set(key, JSON.stringify(tokens), {
    expiry: { type: TimeUnit.Seconds, count: SESSION_EXPIRATION_SECONDS },
  });
};

export const getSession = async (
  sessionId: string,
): Promise<(TokenEndpointResponse & TokenEndpointResponseHelpers) | null> => {
  const key = `${SESSION_PREFIX}${sessionId}`;
  const data = await storeClient.get(key);
  if (!data) {
    return null;
  }

  await storeClient.expire(key, SESSION_EXPIRATION_SECONDS);

  return JSON.parse(data.toString());
};

export const deleteSession = async (sessionId: string) => {
  await storeClient.del([`${SESSION_PREFIX}${sessionId}`]);
};
