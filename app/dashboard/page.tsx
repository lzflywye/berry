import { DashboardPanel } from "@/components/dashboardPanel";
import { requireUser } from "@/lib/authGuard";

const DashboardPage = async () => {
  const user = await requireUser(true);

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Dashboard
        </h1>
        <p className="text-neutral-500">
          Welcome back,{" "}
          <span className="text-foreground font-medium">
            {user.displayName}
          </span>
          . Your account status is{" "}
          <span className="font-mono text-xs uppercase tracking-wider">
            {user.status}
          </span>
          .
        </p>
      </header>

      <DashboardPanel />
    </div>
  );
};

export default DashboardPage;
