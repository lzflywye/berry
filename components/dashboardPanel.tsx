"use client";

import { fetchAdminInfoAction, fetchUserInfoAction } from "@/actions/dashboard";
import { CircleXIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";

export const DashboardPanel = () => {
  const [adminInfoResponse, setAdminInfoResponse] = useState("");
  const [userInfoResponse, setUserInfoResponse] = useState("");
  const [error, setError] = useState("");

  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const handleFetchUserInfo = async () => {
    if (loadingUser) return;
    setLoadingUser(true);
    setError("");

    try {
      const result = await fetchUserInfoAction();

      if (result.success) {
        setUserInfoResponse(JSON.stringify(result.data, null, 2));
      } else {
        setError(result.error);
      }
    } catch {
      setError("Unexpected error occurred");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleFetchAdminInfo = async () => {
    if (loadingAdmin) return;
    setLoadingAdmin(true);
    setError("");

    try {
      const result = await fetchAdminInfoAction();

      if (result.success) {
        setAdminInfoResponse(result.data);
      } else {
        setError(result.error);
      }
    } finally {
      setLoadingAdmin(false);
    }
  };

  return (
    <main className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      <div className="p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
            API Connectivity Check
          </h2>
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
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                User Role
              </h3>
            </div>
            <button
              onClick={handleFetchUserInfo}
              disabled={loadingUser}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loadingUser ? (
                <>
                  <LoaderCircleIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Fetching...
                </>
              ) : (
                "Fetch User Information"
              )}
            </button>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              <pre
                className={`relative bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto font-mono min-h-[150px] border border-gray-800 shadow-inner ${
                  !userInfoResponse
                    ? "flex items-center justify-center text-gray-400 italic"
                    : ""
                }`}
              >
                {userInfoResponse || "No data fetched yet..."}
              </pre>
            </div>
          </div>

          {/* Admin Info Section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Admin Role
              </h3>
            </div>
            <button
              onClick={handleFetchAdminInfo}
              disabled={loadingAdmin}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loadingAdmin ? (
                <>
                  <LoaderCircleIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" />
                  Fetching...
                </>
              ) : (
                "Fetch Admin Information"
              )}
            </button>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-linear-to-r from-gray-600 to-gray-400 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
              <pre
                className={`relative bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto font-mono min-h-[150px] border border-gray-800 shadow-inner ${
                  !adminInfoResponse
                    ? "flex items-center justify-center text-gray-400 italic"
                    : ""
                }`}
              >
                {adminInfoResponse || "No data fetched yet..."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
