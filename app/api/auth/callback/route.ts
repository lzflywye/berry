import { getOidcConfig } from "@/lib/oidc";
import { createSession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { authorizationCodeGrant } from "openid-client";
import { v4 as uuidv4 } from "uuid";

export const GET = async (req: NextRequest) => {
  const config = await getOidcConfig();
  const cookieStore = await cookies();

  const pkceVerifier = cookieStore.get("pkce_verifier")?.value;
  const expectedState = cookieStore.get("oidc_state")?.value;
  const expectedNonce = cookieStore.get("oidc_nonce")?.value;

  if (!pkceVerifier) {
    return NextResponse.redirect(
      new URL("/login?error=missing_verifier", req.nextUrl),
    );
  }

  try {
    const tokens = await authorizationCodeGrant(config, req, {
      pkceCodeVerifier: pkceVerifier,
      expectedState: expectedState,
      expectedNonce: expectedNonce,
    });

    cookieStore.delete("pkce_verifier");
    cookieStore.delete("oidc_state");
    cookieStore.delete("oidc_nonce");

    const sessionId = uuidv4();
    await createSession(sessionId, tokens);

    cookieStore.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  } catch (err) {
    console.error("Callback Error Details:", err);

    return NextResponse.redirect(
      new URL("/login?error=callback_failed", req.nextUrl),
    );
  }
};
