import { redirect } from "next/navigation";
import type { paths } from "./api/cyrene";
import { createAuthClient } from "./api/factory";

const CYRENE_API_URL = process.env.CYRENE_API_URL!;

type User =
  paths["/api/users/me"]["get"]["responses"]["200"]["content"]["application/json"];

export function requireUser(
  redirectOnPending?: boolean,
  strict?: true,
): Promise<User>;

export function requireUser(
  redirectOnPending?: boolean,
  strict?: false,
): Promise<User | null>;

export async function requireUser(
  redirectOnPending = true,
  strict = true,
): Promise<User | null> {
  const client = await createAuthClient<paths>(CYRENE_API_URL);

  if (!client) {
    if (strict) redirect("/api/auth/session-expired");
    return null;
  }

  const { data: user, error } = await client.GET("/api/users/me");

  if (error || !user) {
    if (strict) redirect("/login");
    return null;
  }

  if (user.status === "PENDING" && redirectOnPending) {
    redirect("/onboarding");
  }

  if (user.status === "ACTIVE" && !redirectOnPending) {
    redirect("/dashboard");
  }

  return user;
}
