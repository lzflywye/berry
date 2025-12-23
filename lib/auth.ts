import { decodeJwt } from "jose";
import { cookies } from "next/headers";
import { refreshTokenGrant } from "openid-client";
import { getOidcConfig } from "./oidc";
import { createSession, verifySession } from "./session";

const EXP_BUFFER_SECONDS = 5;

const isExpired = (exp: number): boolean => {
  return Date.now() / 1000 > exp - EXP_BUFFER_SECONDS;
};

export const getValidAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return null;
  }

  const invalidateSession = async () => {
    // await revokeSession(sessionId);
    // cookieStore.delete("session_id");
    return null;
  };

  try {
    const tokens = await verifySession(sessionId);
    if (!tokens?.access_token) {
      return await invalidateSession();
    }

    const payload = decodeJwt(tokens.access_token);

    if (payload.exp && !isExpired(payload.exp)) {
      return tokens.access_token;
    }

    if (!tokens.refresh_token) {
      return await invalidateSession();
    }

    const config = await getOidcConfig();
    const newTokens = await refreshTokenGrant(config, tokens.refresh_token);

    await createSession(sessionId, newTokens);

    return newTokens.access_token;
  } catch {
    return await invalidateSession();
  }
};
