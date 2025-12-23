"use server";

import type { paths } from "@/lib/api/cyrene";
import { createAuthClient } from "@/lib/api/factory";
import type { AdminStats, UserPageResponse, UserStatus } from "@/types/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const CYRENE_API_URL = process.env.CYRENE_API_URL!;

type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getAdminStatsAction(): Promise<
  ActionResponse<AdminStats>
> {
  const client = await createAuthClient<paths>(CYRENE_API_URL);
  if (!client) {
    redirect("/login");
  }

  const { data, error } = await client.GET("/api/admin/stats");

  if (error || !data) {
    return { success: false, error: "Failed to fetch stats" };
  }
  return { success: true, data };
}

export async function searchUsersAction(
  query: string,
  status: UserStatus | undefined,
  page: number,
): Promise<ActionResponse<UserPageResponse>> {
  const client = await createAuthClient<paths>(CYRENE_API_URL);
  if (!client) {
    redirect("/login");
  }

  const { data, error } = await client.GET("/api/admin/users", {
    params: {
      query: {
        query: query || undefined,
        status: status,
        page,
        size: 10,
      },
    },
  });

  if (error || !data) {
    return { success: false, error: "Failed to fetch users" };
  }
  return { success: true, data };
}

export async function updateUserStatusAction(
  userId: string,
  newStatus: UserStatus,
) {
  const client = await createAuthClient<paths>(CYRENE_API_URL);
  if (!client) {
    redirect("/login");
  }

  const { error } = await client.PUT("/api/admin/users/{userId}/status", {
    params: { path: { userId } },
    body: { status: newStatus },
  });

  if (error) {
    return { success: false, error: "Failed to update status" };
  }

  revalidatePath("/dashboard/admin");
  return { success: true };
}
