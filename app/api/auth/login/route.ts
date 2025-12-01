import { getOIDCConfig } from "@/lib/oidc";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
  randomPKCECodeVerifier,
  randomState,
} from "openid-client";

export const GET = async () => {
  const config = await getOIDCConfig();
  const cookieStore = await cookies();
  const secureCookie = process.env.NODE_ENV === "production";

  const code_verifier = randomPKCECodeVerifier();
  const code_challenge = await calculatePKCECodeChallenge(code_verifier);
  const code_challenge_method = "S256";

  cookieStore.set("pkce_verifier", code_verifier, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
  });

  const parameters: Record<string, string> = {
    redirect_uri: process.env.OIDC_CALLBACK_URI!,
    scope: "openid",
    code_challenge,
    code_challenge_method,
  };

  let state: string | undefined;
  if (!config.serverMetadata().supportsPKCE()) {
    state = randomState();
    parameters.state = state;
    cookieStore.set("oidc_state", state, {
      httpOnly: true,
      secure: secureCookie,
      sameSite: "lax",
    });
  }

  const redirectTo = buildAuthorizationUrl(config, parameters);

  return NextResponse.redirect(redirectTo);
};
