import {
  allowInsecureRequests,
  ClientSecretPost,
  Configuration,
  discovery,
} from "openid-client";

let keycloakConfig: Configuration;

const initializeKeycloakConfig = async (): Promise<Configuration> => {
  const config = await discovery(
    new URL(process.env.KEYCLOAK_ISSUER!),
    process.env.KEYCLOAK_CLIENT_ID!,
    process.env.KEYCLOAK_CLIENT_SECRET!,
    ClientSecretPost(),
    { execute: [allowInsecureRequests] },
  );

  return config;
};

export const getKeycloakConfig = async (): Promise<Configuration> => {
  if (!keycloakConfig) {
    keycloakConfig = await initializeKeycloakConfig();
  }

  return keycloakConfig;
};
