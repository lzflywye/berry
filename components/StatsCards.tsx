import type { AdminStats } from "@/types/admin";
import {
  ClockIcon,
  UserCheckIcon,
  UsersIcon,
  UserXIcon,
  type LucideIcon,
} from "lucide-react";

type StatsCardsProps = {
  stats: AdminStats;
};

export const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <Card label="Total Users" value={stats.total} icon={UsersIcon} />
      <Card label="Active" value={stats.active} icon={UserCheckIcon} />
      <Card label="Pending" value={stats.pending} icon={ClockIcon} />
      <Card label="Suspended" value={stats.suspended} icon={UserXIcon} />
    </div>
  );
};

interface CardProps {
  label: string;
  value: number;
  icon: LucideIcon;
}

const Card = ({ label, value, icon: Icon }: CardProps) => (
  <div className="flex flex-col gap-2 border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300">
    <div className="flex items-center justify-between text-neutral-500">
      <span className="text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
      <Icon className="h-4 w-4" />
    </div>
    <div className="text-2xl font-bold tracking-tight text-foreground">
      {value ?? 0}
    </div>
  </div>
);
