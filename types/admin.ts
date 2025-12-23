import type {
  components as cyreneComponents,
  paths as cyrenePaths,
} from "@/lib/api/cyrene";

export type AdminStats =
  cyrenePaths["/api/admin/stats"]["get"]["responses"]["200"]["content"]["application/json"];

export type UserPageResponse =
  cyrenePaths["/api/admin/users"]["get"]["responses"]["200"]["content"]["application/json"];

export type UserProfile = cyreneComponents["schemas"]["UserProfile"];

export type UserStatus = NonNullable<
  cyreneComponents["schemas"]["UserProfile"]["status"]
>;

export const ALL_USER_STATUSES: UserStatus[] = [
  "ACTIVE",
  "DELETED",
  "PENDING",
  "SUSPENDED",
];

export type StatusUpdateRequest =
  cyreneComponents["schemas"]["StatusUpdateRequest"];
