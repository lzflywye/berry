import { requireUser } from "@/lib/authGuard";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const Home = async () => {
  const user = await requireUser(false, false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-8">
        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl font-sans">
          Berry
        </h1>

        {/* Action Button */}
        <div>
          {user ? (
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-105 active:scale-95"
            >
              Go to Dashboard
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <a
              href="/api/auth/login"
              className="group flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-105 active:scale-95"
            >
              Log in
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
