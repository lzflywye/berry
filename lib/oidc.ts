import {
  allowInsecureRequests,
  ClientSecretPost,
  Configuration,
  discovery,
} from "openid-client";

let OidcConfig: Configuration;

const initializeOidcConfig = async (): Promise<Configuration> => {
  const config = await discovery(
    new URL(process.env.OIDC_ISSUER!),
    process.env.OIDC_CLIENT_ID!,
    process.env.OIDC_CLIENT_SECRET!,
    ClientSecretPost(),
    { execute: [allowInsecureRequests] },
  );

  return config;
};

export const getOidcConfig = async (): Promise<Configuration> => {
  if (!OidcConfig) {
    OidcConfig = await initializeOidcConfig();
  }

  return OidcConfig;
};
