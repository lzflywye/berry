import { GlideClient, GlideString, TimeUnit } from "@valkey/valkey-glide";

const storeClient = await GlideClient.createClient({
  addresses: [
    { host: process.env.VALKEY_URL!, port: Number(process.env.VALKEY_PORT!) },
  ],
  useTLS: false,
  requestTimeout: 5000,
});

const SESSION_PREFIX = "session:";
const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7日間

export interface Tokens {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
}

export const saveSession = async (
  sessionId: string,
  tokens: Tokens,
): Promise<"OK" | GlideString | null> => {
  const key = `${SESSION_PREFIX}${sessionId}`;

  return await storeClient.set(key, JSON.stringify(tokens), {
    expiry: { type: TimeUnit.Seconds, count: SESSION_EXPIRATION_SECONDS },
  });
};

export const getSession = async (sessionId: string): Promise<Tokens | null> => {
  const key = `${SESSION_PREFIX}${sessionId}`;
  const data = await storeClient.get(key);
  if (!data) {
    return null;
  }

  await storeClient.expire(key, SESSION_EXPIRATION_SECONDS);

  return JSON.parse(data.toString()) as Tokens;
};

export const deleteSession = async (sessionId: string) => {
  await storeClient.del([`${SESSION_PREFIX}${sessionId}`]);
};
