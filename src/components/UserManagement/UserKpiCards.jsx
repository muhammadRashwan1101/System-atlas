import React from "react";
import { FiUsers, FiMail, FiRadio } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi2";

export default function UserKpiCards({ stats = {} }) {
  const totalUsers = stats.totalUsers ?? 1284;
  const pendingUsers = stats.pendingUsers ?? 42;
  const teamsCount = stats.teamsCount ?? 18;
  const activeUsers = stats.activeUsers ?? 312;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Users */}
      <div className="bg-[#121418] border border-[#232730] rounded-xl p-5 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs font-mono text-[#8b949e]">
          <span className="tracking-wider uppercase font-semibold">TOTAL USERS</span>
          <div className="p-2 rounded-lg bg-[#1a1e26] border border-[#2b3240] text-sky-400">
            <FiUsers className="text-sm" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-white font-(family-name:--headers) tracking-tight">
            {totalUsers.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1">
            <span>↗ +12%</span>
            <span className="text-[#8b949e]">vs last month</span>
          </p>
        </div>
      </div>

      {/* 2. Pending */}
      <div className="bg-[#121418] border border-[#232730] rounded-xl p-5 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs font-mono text-[#8b949e]">
          <span className="tracking-wider uppercase font-semibold">PENDING</span>
          <div className="p-2 rounded-lg bg-[#1a1e26] border border-[#2b3240] text-amber-400">
            <FiMail className="text-sm" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-white font-(family-name:--headers) tracking-tight">
            {pendingUsers}
          </div>
          <p className="text-[11px] text-[#8b949e] font-mono mt-1">
            Awaiting verification
          </p>
        </div>
      </div>

      {/* 3. Teams */}
      <div className="bg-[#121418] border border-[#232730] rounded-xl p-5 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs font-mono text-[#8b949e]">
          <span className="tracking-wider uppercase font-semibold">TEAMS</span>
          <div className="p-2 rounded-lg bg-[#1a1e26] border border-[#2b3240] text-indigo-400">
            <HiUserGroup className="text-sm" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-white font-(family-name:--headers) tracking-tight">
            {teamsCount}
          </div>
          <p className="text-[11px] text-[#8b949e] font-mono mt-1">
            Across 4 departments
          </p>
        </div>
      </div>

      {/* 4. Active Users */}
      <div className="bg-[#121418] border border-[#232730] rounded-xl p-5 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs font-mono text-[#8b949e]">
          <span className="tracking-wider uppercase font-semibold">ACTIVE USERS</span>
          <div className="p-2 rounded-lg bg-[#1a1e26] border border-[#2b3240] text-emerald-400">
            <FiRadio className="text-sm animate-pulse" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-(family-name:--headers) tracking-tight">
            {activeUsers}
          </div>
          <p className="text-[11px] text-emerald-400 font-mono mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Live now</span>
          </p>
        </div>
      </div>
    </div>
  );
}
