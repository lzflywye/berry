import { cookies } from "next/headers";
import { deleteSession, getSession, saveSession } from "./sessionStore";
import { getKeycloakConfig } from "./keycloack";
import { refreshTokenGrant } from "openid-client";
import { decodeJwt } from "jose";

const isExpired = (exp: number): boolean => {
  const bufferSeconds = 5;
  return Date.now() / 1000 > exp - bufferSeconds;
};

export const getValidAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session_id")?.value;
  if (!sessionId) {
    return null;
  }

  const tokens = await getSession(sessionId);
  if (!tokens || !tokens.access_token) {
    console.error("Session data invalid or missing in KVS. Deleting session.");
    await deleteSession(sessionId);
    cookieStore.delete("session_id");
    return null;
  }

  try {
    const payload = decodeJwt(tokens.access_token);
    if (!payload.exp) {
      console.error("Access token has no 'exp' claim.");
      await deleteSession(sessionId);
      cookieStore.delete("session_id");
      return null;
    }

    if (isExpired(payload.exp)) {
      console.log("Token expired, refreshing...");

      if (!tokens.refresh_token) {
        console.error("No refresh token available. Session deleted.");
        await deleteSession(sessionId);
        cookieStore.delete("session_id");
        return null;
      }

      try {
        const refreshPayload = decodeJwt(tokens.refresh_token);
        if (!refreshPayload.exp || isExpired(refreshPayload.exp)) {
          console.error("No refresh token available. Session deleted.");
          await deleteSession(sessionId);
          cookieStore.delete("session_id");
          return null;
        }
      } catch {
        console.error("Invalid refresh token format.");
        await deleteSession(sessionId);
        cookieStore.delete("session_id");
        return null;
      }

      try {
        const config = await getKeycloakConfig();
        const newTokens = await refreshTokenGrant(config, tokens.refresh_token);

        await saveSession(sessionId, newTokens);

        return newTokens.access_token;
      } catch (err: unknown) {
        console.error("Failed to refresh token", err);
        await deleteSession(sessionId);
        cookieStore.delete("session_id");
        return null;
      }
    }

    return tokens.access_token;
  } catch (err: unknown) {
    console.error("Failed to decode JWT:", err);
    await deleteSession(sessionId);
    cookieStore.delete("session_id");
    return null;
  }
};
