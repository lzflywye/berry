import { cookies } from "next/headers";
import { deleteSession, getSession, saveSession, Tokens } from "./sessionStore";
import { getKeycloakConfig } from "./keycloack";
import { refreshTokenGrant } from "openid-client";

const isExpired = (expires_at: number): boolean => {
  return Date.now() / 1000 > expires_at - 5;
};

export const getValidAccessToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session_id")?.value;

  if (!sessionId) {
    return null;
  }

  const tokens = await getSession(sessionId);
  if (!tokens) {
    return null;
  }

  if (!tokens.expires_in) {
    return null;
  }

  if (isExpired(tokens.expires_in)) {
    console.log("Token expired, refreshing...");
    if (!tokens.refresh_token) {
      console.error("No refresh token available. Session deleted.");

      await deleteSession(sessionId);
      cookieStore.delete("session_id");
      return null;
    }

    try {
      const config = await getKeycloakConfig();
      const newTokens: Tokens = await refreshTokenGrant(
        config,
        tokens.refresh_token,
      );

      await saveSession(sessionId, newTokens);

      return newTokens.access_token;
    } catch (err) {
      console.error("Failed to refresh token", err);

      await deleteSession(sessionId);
      cookieStore.delete("session_id");
      return null;
    }
  }

  return tokens.access_token;
};
