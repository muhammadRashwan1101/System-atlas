import React, { useState } from "react";
import { FiMoreVertical, FiEye, FiTrash2, FiKey, FiPauseCircle } from "react-icons/fi";
import Avatar from "../Utils/Avatar";

export default function UserTable({
  users = [],
  selectedUser = null,
  onSelectUser,
  onStatusChange,
  onResetPassword,
  onDeleteUser,
  currentPage = 1,
  totalPages = 1,
  totalUsers = 0,
  onPrevPage,
  onNextPage,
}) {
  const [activeMenuId, setActiveMenuId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-500/10 text-slate-300 border border-slate-600/40 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Pending
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">
            {status || "Active"}
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#121418] border border-[#232730] rounded-xl overflow-hidden shadow-xl text-xs font-mono flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#1a1e26] border-b border-[#2b3240] text-[10px] text-[#8b949e] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-5 font-semibold">USER</th>
              <th className="py-3 px-5 font-semibold">ROLE</th>
              <th className="py-3 px-5 font-semibold">TEAM</th>
              <th className="py-3 px-5 font-semibold">STATUS</th>
              <th className="py-3 px-5 font-semibold">LAST ACTIVE</th>
              <th className="py-3 px-5 font-semibold text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232730] text-slate-300">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                  No users found matching your criteria.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isSelected = selectedUser?._id === u._id;
                const userName =
                  `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                  u.name ||
                  "Alex Rivera";
                const userEmail = u.email || "user@system-atlas.io";
                const userRole = u.titleRole || u.roleTitle || (u.role === "admin" ? "System Architect" : u.role === "manager" ? "SRE Lead" : "DevOps Eng");
                const userTeam = u.teamName || (typeof u.team === "object" ? u.team?.name : u.team) || "Infrastructure";
                const userStatus = u.status || "ACTIVE";
                const lastActive = u.lastActive || "2 min ago";

                return (
                  <tr
                    key={u._id || u.id}
                    onClick={() => onSelectUser && onSelectUser(u)}
                    className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${
                      isSelected ? "bg-white/[0.04] border-l-2 border-sky-400" : ""
                    }`}
                  >
                    {/* User Info */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar
                          avatarUrl={u.avatar}
                          name={userName}
                          size="w-9 h-9 text-xs"
                          className="rounded-lg ring-1 ring-[#2b3240] shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white block text-sm font-(family-name:--headers) truncate">
                            {userName}
                          </span>
                          <span className="text-[11px] text-[#8b949e] block font-mono truncate mt-0.5">
                            {userEmail}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded bg-[#1a1e26] border border-[#2b3240] text-[11px] font-mono text-[#D8E2FF] whitespace-nowrap">
                        {userRole}
                      </span>
                    </td>

                    {/* Team */}
                    <td className="py-3.5 px-5 text-slate-300 font-sans text-xs">
                      {userTeam}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5">{getStatusBadge(userStatus)}</td>

                    {/* Last Active */}
                    <td className="py-3.5 px-5 text-[#8b949e] font-mono text-[11px] whitespace-nowrap">
                      {lastActive}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 px-5 text-right relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === u._id ? null : u._id);
                        }}
                        className="p-1.5 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        title="Actions"
                      >
                        <FiMoreVertical className="text-base" />
                      </button>

                      {activeMenuId === u._id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-4 top-10 w-44 bg-[#1a1e26] border border-[#2b3240] rounded-xl shadow-2xl py-1 z-30 flex flex-col font-sans text-xs"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              if (onSelectUser) onSelectUser(u);
                            }}
                            className="px-3.5 py-2 text-left text-slate-200 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                          >
                            <FiEye className="text-sky-400" />
                            <span>View Details</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              if (onStatusChange) {
                                onStatusChange(
                                  u._id,
                                  userStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
                                );
                              }
                            }}
                            className="px-3.5 py-2 text-left text-slate-200 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                          >
                            <FiPauseCircle className="text-amber-400" />
                            <span>
                              {userStatus === "SUSPENDED" ? "Activate User" : "Suspend User"}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              if (onResetPassword) onResetPassword(u);
                            }}
                            className="px-3.5 py-2 text-left text-slate-200 hover:bg-white/5 flex items-center gap-2 cursor-pointer"
                          >
                            <FiKey className="text-indigo-400" />
                            <span>Reset Password</span>
                          </button>

                          <div className="h-px bg-[#2b3240] my-1" />

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              if (onDeleteUser) onDeleteUser(u);
                            }}
                            className="px-3.5 py-2 text-left text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer"
                          >
                            <FiTrash2 className="text-rose-400" />
                            <span>Delete User</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#232730] bg-[#121418] text-xs text-[#8b949e]">
        <span>
          Showing {users.length > 0 ? (currentPage - 1) * 10 + 1 : 0}-{Math.min(currentPage * 10, totalUsers || users.length)} of {totalUsers || users.length} users
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-[#1a1e26] border border-[#2b3240] rounded text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNextPage}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-[#1a1e26] border border-[#2b3240] rounded text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
