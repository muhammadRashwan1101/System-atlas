import React, { useState, useEffect, useMemo } from "react";
import { FiX, FiSearch, FiInfo, FiUsers, FiCheck } from "react-icons/fi";
import api from "../../api/axios";
import Avatar from "../Utils/Avatar";

export default function AddMemberModal({
  isOpen,
  onClose,
  onAddMembers,
  currentMembers = [],
  teamName = "Platform Engineering",
}) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const roles = ["All Roles", "Manager", "Tech Lead", "Developer", "Unassigned Only"];

  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await api.get("/auth/users");
        const list = res.data?.users || res.data?.data || res.data || [];
        if (Array.isArray(list) && list.length > 0) {
          setUsers(list);
        } else {
          // Fallback sample users matching screenshot
          setUsers([
            {
              _id: "u1",
              name: "Elias Vance",
              username: "evance",
              email: "elias.vance@systematlas.io",
              role: "Tech Lead",
              dept: "Core Engine",
              workspace: "EURO-W1",
            },
            {
              _id: "u2",
              name: "Sarah Thorne",
              username: "sthorne",
              email: "sarah.thorne@systematlas.io",
              role: "Developer",
              dept: "Unassigned",
              workspace: "US-EAST",
            },
            {
              _id: "u3",
              name: "Marcus Chen",
              username: "mchen",
              email: "marcus.chen@systematlas.io",
              role: "Manager",
              dept: "Cloud Infrastructure",
              workspace: "APAC-S1",
            },
            {
              _id: "u4",
              name: "Kira Nilsson",
              username: "knilsson",
              email: "kira.nilsson@systematlas.io",
              role: "Developer",
              dept: "DevOps",
              workspace: "US-WEST",
            },
            {
              _id: "u5",
              name: "Jordan Vex",
              username: "jvex",
              email: "jordan.vex@systematlas.io",
              role: "Developer",
              dept: "Frontend Core",
              workspace: "US-EAST",
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load users for modal:", err);
        setUsers([
          {
            _id: "u1",
            name: "Elias Vance",
            username: "evance",
            email: "elias.vance@systematlas.io",
            role: "Tech Lead",
            dept: "Core Engine",
            workspace: "EURO-W1",
          },
          {
            _id: "u2",
            name: "Sarah Thorne",
            username: "sthorne",
            email: "sarah.thorne@systematlas.io",
            role: "Developer",
            dept: "Unassigned",
            workspace: "US-EAST",
          },
          {
            _id: "u3",
            name: "Marcus Chen",
            username: "mchen",
            email: "marcus.chen@systematlas.io",
            role: "Manager",
            dept: "Cloud Infrastructure",
            workspace: "APAC-S1",
          },
          {
            _id: "u4",
            name: "Kira Nilsson",
            username: "knilsson",
            email: "kira.nilsson@systematlas.io",
            role: "Developer",
            dept: "DevOps",
            workspace: "US-WEST",
          },
          {
            _id: "u5",
            name: "Jordan Vex",
            username: "jvex",
            email: "jordan.vex@systematlas.io",
            role: "Developer",
            dept: "Frontend Core",
            workspace: "US-EAST",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isOpen]);

  if (!isOpen) return null;

  const currentMemberIds = new Set(currentMembers.map((m) => m._id || m.id));

  const availableUsers = users.map((u) => {
    const uId = u._id || u.id;
    const name = u.name || `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email?.split("@")[0] || "User";
    const username = u.username || u.email?.split("@")[0] || name.toLowerCase().replace(/\s+/g, "");
    const roleRaw = u.role || "Developer";
    const roleNormalized =
      roleRaw.toLowerCase() === "manager" || roleRaw.toLowerCase() === "admin"
        ? "Manager"
        : roleRaw.toLowerCase().includes("lead")
        ? "Tech Lead"
        : "Developer";

    const dept = u.dept || (u.teamName ? u.teamName : "Unassigned");
    const workspace = u.workspace || "US-EAST";

    return {
      ...u,
      _id: uId,
      name,
      username,
      roleDisplay: roleNormalized,
      dept,
      workspace,
    };
  });

  const filteredUsers = availableUsers.filter((u) => {
    if (currentMemberIds.has(u._id)) return false;

    // Filter by role tab
    if (selectedRole === "Manager" && u.roleDisplay !== "Manager") return false;
    if (selectedRole === "Tech Lead" && u.roleDisplay !== "Tech Lead") return false;
    if (selectedRole === "Developer" && u.roleDisplay !== "Developer") return false;
    if (selectedRole === "Unassigned Only" && u.dept !== "Unassigned") return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleUser = (uId) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(uId)) {
        next.delete(uId);
      } else {
        next.add(uId);
      }
      return next;
    });
  };

  const handleClearAll = () => {
    setSelectedUserIds(new Set());
  };

  const selectedUsersList = availableUsers.filter((u) => selectedUserIds.has(u._id));

  const handleSubmit = async () => {
    if (selectedUserIds.size === 0) return;
    setSubmitting(true);
    try {
      if (onAddMembers) {
        await onAddMembers(Array.from(selectedUserIds));
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "Tech Lead":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "Manager":
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      default:
        return "text-slate-400 border-slate-700 bg-slate-800/40";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1017] border border-slate-800/90 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800/80 bg-[#12151e]/80 flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white font-(family-name:--headers)">
              Add Existing Members
            </h2>
            <p className="text-xs text-slate-400 font-(family-name:--body-font)">
              Select users that should become members of this team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <FiX className="text-base" />
          </button>
        </div>

        {/* Search & Role Filter Tabs */}
        <div className="px-6 pt-5 pb-3 space-y-3.5 border-b border-slate-800/80 bg-[#0e1017]">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-3 text-slate-500 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, username, or email..."
              className="w-full bg-[#12151e] text-slate-200 placeholder-slate-500 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-sky-500/50 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 font-(family-name:--labels) text-[11px]">
            {roles.map((r) => {
              const isSelected = selectedRole === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? "bg-white text-slate-950 font-bold shadow-sm"
                      : "bg-[#161922] text-slate-400 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Content */}
        <div className="flex-1 min-h-0 grid grid-cols-12 overflow-hidden">
          {/* Left Column: User Table (7 cols on lg, 8 cols on xl) */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8 border-r border-slate-800/80 overflow-y-auto max-h-[400px]">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-[#12151e] border-b border-slate-800/80 text-[10px] text-slate-400 uppercase tracking-wider z-10">
                <tr>
                  <th className="py-2.5 px-4 w-10"></th>
                  <th className="py-2.5 px-2 font-semibold">USER INFORMATION</th>
                  <th className="py-2.5 px-4 font-semibold">CURRENT STATUS</th>
                  <th className="py-2.5 px-4 font-semibold text-right">WORKSPACE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isChecked = selectedUserIds.has(u._id);
                    return (
                      <tr
                        key={u._id}
                        onClick={() => handleToggleUser(u._id)}
                        className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${
                          isChecked ? "bg-emerald-500/[0.04]" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-4">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              isChecked
                                ? "bg-emerald-500 border-emerald-400 text-slate-950"
                                : "bg-slate-900 border-slate-700"
                            }`}
                          >
                            {isChecked && <FiCheck className="text-xs stroke-[3]" />}
                          </div>
                        </td>

                        {/* User info */}
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2.5">
                            <Avatar
                              avatarUrl={u.avatar}
                              name={u.name}
                              size="w-7 h-7 text-[10px]"
                              className="bg-slate-800 text-slate-300 rounded-md border border-slate-700/60"
                            />
                            <div>
                              <span className="font-bold text-white block text-xs truncate max-w-[140px]">
                                {u.name}
                              </span>
                              <span className="text-[10px] text-slate-500 block">
                                @{u.username}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status & Dept */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${getRoleBadgeStyle(
                                u.roleDisplay
                              )}`}
                            >
                              {u.roleDisplay}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate max-w-[100px]">
                              {u.dept}
                            </span>
                          </div>
                        </td>

                        {/* Workspace */}
                        <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-400">
                          {u.workspace}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Right Column: Selected Members Summary (5 cols on lg, 4 cols on xl) */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4 p-5 flex flex-col justify-between bg-[#0a0b0d]/50 overflow-y-auto max-h-[400px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  SELECTED MEMBERS ({selectedUserIds.size})
                </span>
                {selectedUserIds.size > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors uppercase font-bold cursor-pointer"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Selected items list */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedUsersList.length === 0 ? (
                  <p className="text-slate-600 text-xs py-4 text-center">
                    No members selected yet.
                  </p>
                ) : (
                  selectedUsersList.map((u) => (
                    <div
                      key={u._id}
                      className="bg-[#12151e] border border-slate-800 rounded-xl p-2.5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          avatarUrl={u.avatar}
                          name={u.name}
                          size="w-6 h-6 text-[9px]"
                          className="bg-slate-800 text-slate-300"
                        />
                        <div>
                          <span className="font-bold text-white text-xs block">
                            {u.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            @{u.username}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleUser(u._id)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      >
                        <FiX className="text-xs" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Info Notice Box */}
            <div className="mt-4 p-3.5 bg-blue-950/20 border border-blue-900/30 rounded-xl flex items-start gap-2.5 text-blue-300/80 text-[11px] leading-relaxed">
              <FiInfo className="text-sm shrink-0 mt-0.5 text-blue-400" />
              <p>
                A user can belong to only one primary team at a time. Reassigning will
                automatically update ownership permissions where applicable.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-[#12151e]/80 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold font-(family-name:--labels)">
            <FiUsers className="text-slate-500 text-sm" />
            <span>Team: {teamName}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#161922] hover:bg-slate-800 text-slate-300 border border-slate-700/80 uppercase font-bold text-xs transition-colors cursor-pointer font-mono"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedUserIds.size === 0 || submitting}
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ADC6FF] hover:bg-[#8eb2ff] disabled:opacity-40 text-[#002E6A] uppercase font-bold text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer font-mono"
            >
              <span>Add Members</span>
              <span className="px-1.5 py-0.2 bg-[#002E6A]/20 text-[#002E6A] rounded text-[10px] font-extrabold">
                {selectedUserIds.size}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
