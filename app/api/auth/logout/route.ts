import { getOidcConfig } from "@/lib/oidc";
import { revokeSession, verifySession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { buildEndSessionUrl, tokenRevocation } from "openid-client";

export const GET = async (req: NextRequest) => {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  const fallbackRedirect = NextResponse.redirect(new URL("/", req.nextUrl));

  if (!sessionId) {
    return fallbackRedirect;
  }

  const config = await getOidcConfig();
  const tokens = await verifySession(sessionId);

  await revokeSession(sessionId);
  cookieStore.delete("session_id");

  if (!tokens) {
    return fallbackRedirect;
  }

  try {
    const revokationPromises = [];

    if (tokens.access_token) {
      revokationPromises.push(
        tokenRevocation(config, tokens.access_token, {
          token_type_hint: "access_token",
        }),
      );
    }

    if (tokens.refresh_token) {
      revokationPromises.push(
        tokenRevocation(config, tokens.refresh_token, {
          token_type_hint: "refresh_token",
        }),
      );
    }

    await Promise.allSettled(revokationPromises);
  } catch (err: unknown) {
    console.warn("Failed to revoke tokens on IdP:", err);
  }

  if (tokens.id_token) {
    try {
      const endSessionUrl = buildEndSessionUrl(config, {
        id_token_hint: tokens.id_token,
        post_logout_redirect_uri: process.env.POST_LOGOUT_REDIRECT_URI!,
      });

      return NextResponse.redirect(endSessionUrl);
    } catch (err: unknown) {
      console.warn("Failed to build end session url", err);
    }
  }

  return fallbackRedirect;
};
