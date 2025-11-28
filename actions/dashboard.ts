"use server";

import { client } from "@/lib/api/client";
import { getValidAccessToken } from "@/lib/auth";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function fetchUserInfoAction(): Promise<
  ActionResult<{ userName?: string }>
> {
  const token = await getValidAccessToken();
  if (!token) return { success: false, error: "Unauthorized" };

  const { data, error } = await client.GET("/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    console.error("API Error:", error);
    return { success: false, error: "Failed to fetch user info" };
  }

  if (!data) {
    return { success: false, error: "No data received from API" };
  }

  return { success: true, data };
}

export async function fetchAdminInfoAction(): Promise<ActionResult<string>> {
  const token = await getValidAccessToken();
  if (!token) return { success: false, error: "Unauthorized" };

  const { data, error } = await client.GET("/api/admin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
