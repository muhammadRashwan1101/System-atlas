import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FiSearch, FiX, FiInfo, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/axios";
const ROLES = ["All Roles", "Manager", "Tech Lead", "Developer"];
const MAX_TEAMS_PER_USER = 3;
const getUserFullName = (user) =>
  user ? (user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim()) : "";
const getRoleBadgeStyle = (role = "") => {
  const r = role.toLowerCase();
  if (r.includes("tech") || r.includes("lead")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  if (r.includes("dev")) return "bg-[#2b2d42] text-slate-300 border-slate-700";
  if (r.includes("manag")) return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  return "bg-slate-800 text-slate-400 border-slate-700";
};

// ================= Sub-Components =================

const UserAvatar = ({ user, name, size = "w-9 h-9", text = "text-sm" }) => (
  <div className={`${size} rounded-full bg-slate-800 flex items-center justify-center ${text} font-semibold overflow-hidden shrink-0`}>
    {user.avatar ? <img src={user.avatar} alt={name} className="w-full h-full object-cover" /> : name[0]?.toUpperCase()}
  </div>
);

const UserRow = React.memo(({ user, team, isSelected, onToggle }) => {
  const name = getUserFullName(user);
  const teams = Array.isArray(user.teams) ? user.teams : [];

  const alreadyInCurrentTeam = teams.some((t) => String(t?._id || t) === String(team?._id));
  const isFull = teams.length >= MAX_TEAMS_PER_USER;
  const isDisabled = alreadyInCurrentTeam || isFull;

  return (
    <div
      onClick={() => !isDisabled && onToggle(user)}
      className={`grid grid-cols-[2fr_1.5fr_1fr] items-center px-6 py-4 border-b border-slate-800/40 transition ${isSelected ? "bg-slate-800/40" : "hover:bg-slate-800/20"
        } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {/* User Info */}
      <div className="flex items-center gap-3 min-w-0">
        <input type="checkbox" checked={isSelected} disabled={isDisabled} readOnly className="w-4 h-4 accent-emerald-500" />
        <UserAvatar user={user} name={name} />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{name}</p>
          <p className="text-xs text-slate-500 truncate">@{user.username}</p>
        </div>
      </div>

      {/* Role & Current Teams */}
      <div>
        <span className={`px-2 py-1 rounded text-[10px] border uppercase font-mono ${getRoleBadgeStyle(user.role)}`}>
          {user.role}
        </span>
        <div className="flex flex-wrap gap-1 mt-2">
          {teams.length === 0 ? (
            <span className="text-xs text-orange-400">UnAssigned</span>
          ) : (
            teams.map((t) => {
              const teamId = t?._id || t;
              const isCurrent = String(teamId) === String(team?._id);
              return (
                <span key={String(teamId)} className={`px-2 py-0.5 rounded text-[10px] ${isCurrent ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" : "bg-slate-800 text-slate-400"
                  }`}>
                  {t?.teamName || "Team"}
                </span>
              );
            })
          )}
        </div>
      </div>

      {/* Team Limit Capacity */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs text-slate-400">{teams.length}/{MAX_TEAMS_PER_USER} Teams</span>
        {alreadyInCurrentTeam ? (
          <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] border border-blue-500/30">Already Member</span>
        ) : isFull ? (
          <span className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-[10px] border border-red-500/30">Team Limit Reached</span>
        ) : (
          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/30">Available</span>
        )}
      </div>
    </div>
  );
});

const SelectedCard = ({ user, onRemove }) => {
  const name = getUserFullName(user);
  const teamsCount = Array.isArray(user.teams) ? user.teams.length : 0;

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#11141c] border border-slate-800">
      <div className="flex items-center gap-3 min-w-0">
        <UserAvatar user={user} name={name} size="w-8 h-8" text="text-xs" />
        <div className="min-w-0">
          <p className="text-sm text-slate-200 truncate">{name}</p>
          <p className="text-xs text-slate-500 truncate">{user.role}</p>
          <p className="text-[10px] text-slate-600 mt-0.5">Currently in {teamsCount}/{MAX_TEAMS_PER_USER} teams</p>
        </div>
      </div>
      <button onClick={() => onRemove(user._id)} className="text-red-400 hover:text-red-300 transition shrink-0">
        <FiX />
      </button>
    </div>
  );
};

// ================= Main Component =================

export default function AddMemberModal({ isOpen, onClose, team, onGoToTeam }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All Roles");

  // Fetch Users
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await api.get("/users");
        if (isMounted) setUsers(data.users || []);
      } catch (err) {
        if (isMounted) setError(err.message || err.response?.data?.msg || "Failed to load users");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => { isMounted = false; };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setSearch("");
    setSelectedUsers([]);
    setSelectedRole("All Roles");
    setError("");
    onClose();
  }, [onClose]);

  // Filter Users
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((user) => {
      const name = getUserFullName(user).toLowerCase();
      const matchSearch = !q || name.includes(q) || user.username?.toLowerCase().includes(q) || user.email?.toLowerCase().includes(q);

      const userRole = user.role?.toLowerCase() || "";
      let matchRole = true;

      if (selectedRole === "Manager") matchRole = userRole === "manager";
      if (selectedRole === "Tech Lead") matchRole = userRole === "techlead" || userRole.includes("lead");
      if (selectedRole === "Developer") matchRole = userRole === "developer" || userRole.includes("dev");

      return matchSearch && matchRole;
    });
  }, [users, search, selectedRole]);

  // Actions
  const handleToggleUser = useCallback((user) => {
    const teams = Array.isArray(user.teams) ? user.teams : [];
    const alreadyInCurrentTeam = teams.some((t) => String(t?._id || t) === String(team?._id));
    const isFull = teams.length >= MAX_TEAMS_PER_USER;

    if (alreadyInCurrentTeam) return toast.info("This user is already a member of this team.");
    if (isFull) return toast.warning(`This user already belongs to ${MAX_TEAMS_PER_USER} teams.`);

    setSelectedUsers((prev) =>
      prev.some((m) => m._id === user._id) ? prev.filter((m) => m._id !== user._id) : [...prev, user]
    );
  }, [team]);

  const handleRemoveMember = useCallback((id) => {
    setSelectedUsers((prev) => prev.filter((m) => m._id !== id));
  }, []);

  const handleAddMembers = async () => {
  if (!team?._id) {
    return toast.error("Target team not found.");
  }

  if (selectedUsers.length === 0) {
    return toast.warning("Please select at least one user.");
  }

  setSubmitting(true);

  try {
    await api.post(`/${team._id}/members`, {
      members: selectedUsers.map((u) => u._id),
    });

    toast.success("Members added successfully!");

    handleClose();
    onGoToTeam?.();

  } catch (err) {
    console.error("Add members error:", err);
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);

    // Don't show another toast here
    // because axios interceptor already shows it.
  } finally {
    setSubmitting(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[95vw] max-w-6xl h-[85vh] bg-[#0B0E15] border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <header className="flex justify-between items-center px-6 py-4 border-b border-slate-800/60 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Add Existing Members</h2>
            <p className="text-xs text-slate-400 mt-0.5">Select users that should become members of this team.</p>
          </div>
          <button onClick={handleClose} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition">
            <FiX className="text-xl" />
          </button>
        </header>

        {/* Search & Filters */}
        <section className="px-6 pt-4 pb-3 shrink-0">
          <div className="flex items-center gap-3 bg-[#11141c] border border-slate-800/80 rounded-lg px-3.5 py-2.5 focus-within:border-slate-700 transition">
            <FiSearch className="text-slate-400 text-base shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users by name, username, or email..."
              className="bg-transparent outline-none w-full text-sm text-slate-200 placeholder-slate-500"
            />
            {search && <button onClick={() => setSearch("")} className="text-xs text-slate-500 hover:text-slate-300">Clear</button>}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-3.5 py-1 rounded-full text-xs transition border ${selectedRole === role
                    ? "bg-[#c5d7f2] text-slate-900 border-transparent font-medium"
                    : "bg-[#11141c] text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
        </section>

        {/* Main Content */}
        <main className="flex flex-1 min-h-0 border-t border-slate-800/60 overflow-hidden">
          {/* User Table */}
          <div className="w-full md:w-[66%] border-r border-slate-800/60 flex flex-col">
            <div className="grid grid-cols-[2fr_1.5fr_1fr] px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-800/60 bg-[#090b10] shrink-0">
              <span>User Information</span>
              <span>Current Status</span>
              <span className="text-right">Team Capacity</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full text-sm text-slate-500">Loading users...</div>
              ) : error ? (
                <div className="flex justify-center items-center h-full text-sm text-red-400">{error}</div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex justify-center items-center h-full text-sm text-slate-500">No users found.</div>
              ) : (
                filteredUsers.map((user) => (
                  <UserRow
                    key={user._id}
                    user={user}
                    team={team}
                    isSelected={selectedUsers.some((m) => m._id === user._id)}
                    onToggle={handleToggleUser}
                  />
                ))
              )}
            </div>
          </div>

          {/* Selected Users Sidebar */}
          <aside className="hidden md:flex md:w-[34%] p-5 bg-[#0d0f17] flex-col justify-between overflow-hidden">
            <div className="flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Selected Members ({selectedUsers.length})</h3>
                {selectedUsers.length > 0 && (
                  <button onClick={() => setSelectedUsers([])} className="text-xs text-slate-400 hover:text-slate-200 transition">Clear all</button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                {selectedUsers.length === 0 ? (
                  <p className="text-xs text-slate-600 text-center py-8">No members selected yet.</p>
                ) : (
                  selectedUsers.map((user) => <SelectedCard key={user._id} user={user} onRemove={handleRemoveMember} />)
                )}
              </div>
            </div>

            <div className="mt-4 p-3.5 rounded-xl bg-[#111625]/60 border border-blue-900/40 flex gap-3 shrink-0">
              <FiInfo className="text-blue-400 shrink-0 text-base mt-0.5" />
              <p className="text-xs leading-relaxed text-blue-300/80">
                A user can belong to up to <strong>{MAX_TEAMS_PER_USER} teams</strong>. Users who already belong to other teams can still be added until they reach the limit.
              </p>
            </div>
          </aside>
        </main>

        {/* Footer */}
        <footer className="h-[65px] flex justify-between items-center px-6 border-t border-slate-800/80 bg-[#090b10] shrink-0">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FiUsers className="text-slate-400" />
            <span>Team:</span>
            <span className="text-slate-100 font-semibold truncate max-w-[200px]">{team?.teamName || "N/A"}</span>
          </div>

          <div className="flex gap-3">
            <button onClick={handleClose} className="px-5 py-2 rounded-lg border border-slate-800 text-sm font-medium text-slate-300 hover:bg-slate-800/40 transition">
              Cancel
            </button>
            <button
              onClick={handleAddMembers}
              disabled={selectedUsers.length === 0 || submitting}
              className="px-6 py-2 rounded-lg bg-[#b9ccff] hover:bg-[#a6beff] text-slate-900 font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Adding..." : `Add Members (${selectedUsers.length})`}
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}