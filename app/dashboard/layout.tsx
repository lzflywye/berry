import { LogOutIcon } from "lucide-react";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-neutral-200">
      <nav className="sticky top-0 z-30 border-b border-neutral-200 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/dashboard"
              className="text-lg font-bold tracking-tight"
            >
              Berry
            </Link>

            <a
              href="/api/auth/logout"
              className="group flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-foreground transition-colors"
            >
              Log out
              <LogOutIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12">{children}</main>
    </div>
  );
}
