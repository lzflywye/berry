"use server";

import { createAuthClient } from "@/lib/api/factory";
import type { paths } from "@/lib/api/cyrene";

const CYRENE_API_URL = process.env.CYRENE_API_URL!;

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type UserInfoResponse =
  paths["/api/users/me"]["get"]["responses"][200]["content"]["application/json"];

export async function fetchUserInfoAction(): Promise<
  ActionResult<UserInfoResponse>
> {
  const client = await createAuthClient<paths>(CYRENE_API_URL);
  if (!client) return { success: false, error: "Unauthorized" };

  const { data, error } = await client.GET("/api/users/me");

  if (error) {
    console.error("API Error:", error);
    return { success: false, error: "Failed to fetch user info" };
  }

  if (!data) {
    return { success: false, error: "No data received from API" };
  }

  return { success: true, data };
}
