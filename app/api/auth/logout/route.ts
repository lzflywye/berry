import { getOidcConfig } from "@/lib/oidc";
import { deleteSession, getSession } from "@/lib/sessionStore";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { buildEndSessionUrl, tokenRevocation } from "openid-client";

export const GET = async () => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    const tokens = await getSession(sessionId);

    await deleteSession(sessionId);

    cookieStore.delete("session_id");

    if (tokens) {
      try {
        const config = await getOidcConfig();

        if (tokens.access_token) {
          await tokenRevocation(config, tokens.access_token, {
            token_type_hint: "access_token",
          });
        }

        if (tokens.refresh_token) {
          await tokenRevocation(config, tokens.refresh_token, {
            token_type_hint: "refresh_token",
          });
        }
      } catch (err: unknown) {
        console.warn("Failed to revoke tokens", err);
      }
    }

    if (tokens?.id_token) {
      const config = await getOidcConfig();
      const endSessionUrl = buildEndSessionUrl(config, {
        id_token_hint: tokens.id_token,
        post_logout_redirect_uri: process.env.POST_LOGOUT_REDIRECT_URI!,
      });

      return NextResponse.redirect(endSessionUrl);
    }
  }
};
