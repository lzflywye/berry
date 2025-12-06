import { GlideClient } from "@valkey/valkey-glide";

let client: GlideClient | null = null;

export const getValkeyClient = async (): Promise<GlideClient> => {
  if (client) {
    return client;
  }

  client = await GlideClient.createClient({
    addresses: [
      {
        host: process.env.VALKEY_URL!,
        port: Number(process.env.VALKEY_PORT!),
      },
    ],
    useTLS: process.env.VALKEY_USE_TLS === "true",
  });

  return client;
};
