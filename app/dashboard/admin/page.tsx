import { getAdminStatsAction } from "@/actions/admin";
import { StatsCards } from "@/components/StatsCards";
import { UserTable } from "@/components/UserTable";
import { requireUser } from "@/lib/authGuard";
import { ShieldAlertIcon } from "lucide-react";

export default async function AdminDashboardPage() {
  await requireUser(true);

  const statsRes = await getAdminStatsAction();

  if (!statsRes.success) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-neutral-100 p-4">
          <ShieldAlertIcon className="h-8 w-8 text-neutral-500" />
        </div>
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p className="text-neutral-500">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
        <p className="text-neutral-500">Manage users and system status.</p>
      </div>

      <StatsCards stats={statsRes.data} />

      <div className="space-y-4">
        <h2 className="text-lg font-bold">Users</h2>
        <UserTable />
      </div>
    </div>
  );
}
