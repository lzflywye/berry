"use client";

import { fetchUserInfoAction } from "@/actions/dashboard";
import { CircleAlertIcon, LoaderCircleIcon, TerminalIcon } from "lucide-react";
import { useState } from "react";

export const DashboardPanel = () => {
  const [userInfoResponse, setUserInfoResponse] = useState("");
  const [error, setError] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);

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

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-3 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          <CircleAlertIcon className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* User Role Card */}
      <div className="group flex flex-col space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <h3 className="font-medium">User Profile</h3>
          <span className="text-xs text-neutral-400 font-mono">
            /api/users/me
          </span>
        </div>

        <button
          onClick={handleFetchUserInfo}
          disabled={loadingUser}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loadingUser && <LoaderCircleIcon className="h-4 w-4 animate-spin" />}
          Fetch Data
        </button>

        <div className="relative grow rounded-md border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs text-neutral-600 min-h-40 overflow-x-auto">
          {userInfoResponse ? (
            <pre className="whitespace-pre-wrap">{userInfoResponse}</pre>
          ) : (
            <div className="flex h-full items-center justify-center text-neutral-400 gap-2">
              <TerminalIcon className="w-4 h-4" />
              <span>Waiting for request...</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
