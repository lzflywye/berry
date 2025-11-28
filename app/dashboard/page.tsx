import { DashboardPanel } from "@/components/dashboardPanel";

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <div className="space-x-4">
            <a
              href="/api/auth/login"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Log in
            </a>
            <span className="text-gray-300">|</span>
            <a
              href="/api/auth/logout"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log out
            </a>
          </div>
        </div>

        <DashboardPanel />
      </div>
    </div>
  );
};

export default DashboardPage;
