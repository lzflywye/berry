"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { paths } from "@/lib/api/cyrene";
import { createAuthClient } from "@/lib/api/factory";

const CYRENE_API_URL = process.env.CYRENE_API_URL!;

export const updateProfile = async (formData: FormData) => {
  const displayName = formData.get("displayName") as string;

  if (!displayName) {
    throw new Error("Display name is required");
  }

  const client = await createAuthClient<paths>(CYRENE_API_URL);
  if (!client) {
    redirect("/login");
  }

  const { error } = await client.PUT("/api/users/profile", {
    body: {
      displayName: displayName,
    },
  });

  if (error) {
    console.error("Profile update failed:", error);
    throw new Error("Update failed");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
};
