import {
  allowInsecureRequests,
  ClientSecretPost,
  Configuration,
  discovery,
} from "openid-client";

let oidcConfig: Configuration | undefined;

const initializeOidcConfig = async (): Promise<Configuration> => {
  if (
    !process.env.OIDC_ISSUER ||
    !process.env.OIDC_CLIENT_ID ||
    !process.env.OIDC_CLIENT_SECRET
  ) {
    throw new Error("OIDC environment variables are missing.");
  }

  const config = await discovery(
    new URL(process.env.OIDC_ISSUER!),
    process.env.OIDC_CLIENT_ID!,
    process.env.OIDC_CLIENT_SECRET!,
    ClientSecretPost(),
    process.env.NODE_ENV === "development"
      ? { execute: [allowInsecureRequests] }
      : undefined,
  );

  return config;
};

export const getOidcConfig = async (): Promise<Configuration> => {
  if (!oidcConfig) {
    oidcConfig = await initializeOidcConfig();
  }

  return oidcConfig;
};
