"use server";

import { createAuthClient } from "@/lib/api/factory";
import type { paths } from "@/lib/api/schema";

const API_BASE_URL = process.env.API_BASE_URL!;

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

type UserInfoResponse =
  paths["/api/users/me"]["get"]["responses"][200]["content"]["application/json"];

export async function fetchUserInfoAction(): Promise<
  ActionResult<UserInfoResponse>
> {
  const client = await createAuthClient<paths>(API_BASE_URL);
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

type AdminInfoResponse =
  paths["/api/admin"]["get"]["responses"][200]["content"]["text/plain"];

export async function fetchAdminInfoAction(): Promise<
  ActionResult<AdminInfoResponse>
> {
  const client = await createAuthClient<paths>(API_BASE_URL);
  if (!client) return { success: false, error: "Unauthorized" };

  const { data, error } = await client.GET("/api/admin", {
    parseAs: "text",
  });

  if (error) {
    return { success: false, error: "Failed to fetch admin info" };
  }

  if (!data) {
    return { success: false, error: "No data received from API" };
  }

  return { success: true, data };
}
