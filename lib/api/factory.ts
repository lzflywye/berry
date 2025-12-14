import { getValidAccessToken } from "@/lib/auth";
import createClient, { type ClientOptions } from "openapi-fetch";

export const createAuthClient = async <Paths extends object>(
  baseUrl: string,
  options: ClientOptions = {},
) => {
  const token = await getValidAccessToken();

  if (!token) {
    return null;
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  return createClient<Paths>({
    ...options,
    baseUrl,
    headers,
  });
};
