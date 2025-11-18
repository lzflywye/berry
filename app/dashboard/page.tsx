"use client";

import { CircleXIcon } from "lucide-react";
import { useState } from "react";

const DashboardPage = () => {
  const [adminInfoResponse, setAdminInfoResponse] = useState("");
  const [userInfoResponse, setUserInfoResponse] = useState("");
  const [error, setError] = useState("");

  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const callApi = async (endpoint: string): Promise<string> => {
    setError("");
    try {
      const res = await fetch(endpoint);

      if (!res.ok) {
        throw new Error(`API Error (${res.status}): ${await res.text()}`);
      }

      const data = await res.json();
      return JSON.stringify(data, null, 2);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        console.error("Unknown error:", err);
      }

      return "";
    }
  };

  const handleFetchUserInfo = async () => {
    if (loadingUser) return;
    setLoadingUser(true);
    try {
      const data = await callApi("/api/proxy/users/me");
      setUserInfoResponse(data);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleFetchAdminInfo = async () => {
    if (loadingAdmin) return;
    setLoadingAdmin(true);
    try {
      const data = await callApi("/api/proxy/admin");
      setAdminInfoResponse(data);
    } finally {
      setLoadingAdmin(false);
    }
  };

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

        <main className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
                API Connectivity Check
              </h3>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
                <div className="flex">
                  <div className="shrink-0">
                    <CircleXIcon className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">
                      Error: {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Grid Layout for Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Info Section */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    User Role
                  </h4>
                </div>
                <button
                  onClick={handleFetchUserInfo}
                  disabled={loadingUser}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {loadingUser ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Fetching...
                    </>
                  ) : (
                    "Fetch User Information"
                  )}
                </button>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                  <pre
                    className={`relative bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto font-mono min-h-[150px] border border-gray-800 shadow-inner ${!userInfoResponse ? "flex items-center justify-center text-gray-500 italic" : ""}`}
                  >
                    {userInfoResponse || "No data fetched yet..."}
                  </pre>
                </div>
              </div>

              {/* Admin Info Section */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Admin Role
                  </h4>
                </div>
                <button
                  onClick={handleFetchAdminInfo}
                  disabled={loadingAdmin}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {loadingAdmin ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Fetching...
                    </>
                  ) : (
                    "Fetch Admin Information"
                  )}
                </button>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-linear-to-r from-gray-600 to-gray-400 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                  <pre
                    className={`relative bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto font-mono min-h-[150px] border border-gray-800 shadow-inner ${!adminInfoResponse ? "flex items-center justify-center text-gray-500 italic" : ""}`}
                  >
                    {adminInfoResponse || "No data fetched yet..."}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
