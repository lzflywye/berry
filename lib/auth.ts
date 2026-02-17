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

export const authFetch = async (
  origin: string,
  path: string = "/",
  options: RequestInit = {},
): Promise<[Response, null] | [null, Error]> => {
  try {
    const token = await getValidAccessToken();
    if (!token) {
      return [null, new Error("No token")];
    }

    const response = await fetch(`${origin}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });

    return [response, null];
  } catch (e) {
    return [null, e instanceof Error ? e : new Error(String(e))];
  }
};
