import { getOidcConfig } from "@/lib/oidc";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
  randomNonce,
  randomPKCECodeVerifier,
  randomState,
} from "openid-client";

export const GET = async () => {
  const config = await getOidcConfig();
  const cookieStore = await cookies();
  const secureCookie = process.env.NODE_ENV === "production";

  const code_verifier = randomPKCECodeVerifier();
  const code_challenge = await calculatePKCECodeChallenge(code_verifier);
  const state = randomState();
  const nonce = randomNonce();

  const cookieOptions = {
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10,
  };

  cookieStore.set("pkce_verifier", code_verifier, cookieOptions);
  cookieStore.set("oidc_state", state, cookieOptions);
  cookieStore.set("oidc_nonce", nonce, cookieOptions);

  const parameters: Record<string, string> = {
    redirect_uri: process.env.OIDC_CALLBACK_URI!,
    scope: "openid",
    code_challenge,
    code_challenge_method: "S256",
    state,
    nonce,
  };

  const redirectTo = buildAuthorizationUrl(config, parameters);

  return NextResponse.redirect(redirectTo);
};
