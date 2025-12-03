import { getOidcConfig } from "@/lib/oidc";
import { saveSession } from "@/lib/sessionStore";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { authorizationCodeGrant } from "openid-client";
import { v4 } from "uuid";

export const GET = async (req: NextRequest) => {
  const config = await getOidcConfig();
  const cookieStore = await cookies();

  const pkceVerifier = cookieStore.get("pkce_verifier")?.value;
  const expectedState = cookieStore.get("oidc_state")?.value;

  if (!pkceVerifier) {
    throw new Error("PKCE verifier not found in session.");
  }

  const tokens = await authorizationCodeGrant(config, req, {
    pkceCodeVerifier: pkceVerifier,
    expectedState: expectedState,
  });

  cookieStore.delete("pkce_verifier");
  if (expectedState) {
    cookieStore.delete("oidc_state");
  }

  const sessionId = v4();
  await saveSession(sessionId, tokens);

  cookieStore.set("session_id", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
};
