import {
  allowInsecureRequests,
  ClientSecretPost,
  Configuration,
  discovery,
} from "openid-client";

let OIDCConfig: Configuration;

const initializeOIDCConfig = async (): Promise<Configuration> => {
  const config = await discovery(
    new URL(process.env.OIDC_ISSUER!),
    process.env.OIDC_CLIENT_ID!,
    process.env.OIDC_CLIENT_SECRET!,
    ClientSecretPost(),
    { execute: [allowInsecureRequests] },
  );

  return config;
};

export const getOIDCConfig = async (): Promise<Configuration> => {
  if (!OIDCConfig) {
    OIDCConfig = await initializeOIDCConfig();
  }

  return OIDCConfig;
};
