"use client";

import { searchUsersAction, updateUserStatusAction } from "@/actions/admin";
import type { UserProfile, UserStatus } from "@/types/admin";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

export const UserTable = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<UserStatus | undefined>(
    undefined,
  );
  const [debouncedQuery] = useDebounce(query, 500);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const res = await searchUsersAction(debouncedQuery, filterStatus, 0);
      if (res.success) {
        setUsers(res.data.data || []);
      }
      setLoading(false);
    };
    fetch();
  }, [debouncedQuery, filterStatus, refreshKey]);

  const handleStatusChange = async (user: UserProfile) => {
    if (!user.status) return;

    let nextStatus: UserStatus;

    switch (user.status) {
      case "ACTIVE":
        nextStatus = "SUSPENDED";
        break;
      case "SUSPENDED":
        nextStatus = "ACTIVE";
        break;
      default:
        nextStatus = "ACTIVE";
    }

    if (!confirm(`Change status from ${user.status} to ${nextStatus}?`)) return;

    await updateUserStatusAction(user.userId!, nextStatus);

    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative grow">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full rounded-md border border-neutral-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-neutral-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="rounded-md border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          value={filterStatus || ""}
          onChange={(e) => {
            const val = e.target.value;
            setFilterStatus(val === "" ? undefined : (val as UserStatus));
          }}
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="DELETED">Deleted</option>
        </select>
      </div>

      {/* Table */}
      <div className="min-h-75 overflow-hidden rounded-md border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-neutral-400">
                  <Loader2Icon className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.userId} className="group hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">
                      {user.displayName || "No Name"}
                    </div>
                    <div className="text-xs text-neutral-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-neutral-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleStatusChange(user)}
                      className="text-xs font-medium text-neutral-400 hover:text-foreground hover:underline"
                    >
                      {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status?: UserStatus }) => {
  if (!status) return <span>-</span>;

  const styles: Record<UserStatus, string> = {
    ACTIVE: "bg-neutral-100 text-neutral-700 border-neutral-200",
    PENDING: "bg-white text-neutral-500 border-neutral-200 border-dashed",
    SUSPENDED: "bg-neutral-900 text-white border-neutral-900",
    DELETED:
      "bg-red-50 text-red-500 border-red-100 line-through decoration-red-500/50",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${styles[status] || styles.PENDING}`}
    >
      {status}
    </span>
  );
};
