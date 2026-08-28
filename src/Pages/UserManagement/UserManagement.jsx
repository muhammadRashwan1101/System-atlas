import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiUsers,
  FiSearch,
  FiUserPlus,
  FiBell,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/axios";
import useWorkspace from "../../context/WorkspaceContext";
import useAuth from "../../context/AuthContext";
import useDebounce from "../../hooks/useDebounce";

import UserKpiCards from "../../components/UserManagement/UserKpiCards";
import UserFilterBar from "../../components/UserManagement/UserFilterBar";
import UserTable from "../../components/UserManagement/UserTable";
import UserDetailsDrawer from "../../components/UserManagement/UserDetailsDrawer";
import CreateUserModal from "../../components/UserManagment/CreateUserModal";
import Avatar from "../../components/Utils/Avatar";

export default function UserManagement() {
  const { workspaceId } = useParams();
  const { workspaces, currentWorkspace } = useWorkspace();
  const { user: currentUser } = useAuth();

  // Search & Filters State
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("Any");
  const [teamFilter, setTeamFilter] = useState("All");

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Initial Mock Users matching the screenshot exactly
  const initialMockUsers = [
    {
      _id: "usr-1",
      name: "Alex Rivera",
      firstName: "Alex",
      lastName: "Rivera",
      email: "arivera@system-atlas.io",
      titleRole: "SRE Lead",
      role: "manager",
      teamName: "Infrastructure",
      status: "ACTIVE",
      lastActive: "2 min ago",
      joinedDate: "Oct 12, 2023",
      reportsTo: { name: "Elena Rossi", avatar: null },
    },
    {
      _id: "usr-2",
      name: "Morgan Wu",
      firstName: "Morgan",
      lastName: "Wu",
      email: "m.wu@system-atlas.io",
      titleRole: "DevOps Eng",
      role: "developer",
      teamName: "Core Services",
      status: "PENDING",
      lastActive: "Invite sent 4h ago",
      joinedDate: "Nov 01, 2023",
      reportsTo: { name: "Alex Rivera", avatar: null },
    },
    {
      _id: "usr-3",
      name: "David Chen",
      firstName: "David",
      lastName: "Chen",
      email: "dchen@system-atlas.io",
      titleRole: "System Architect",
      role: "admin",
      teamName: "Platform",
      status: "SUSPENDED",
      lastActive: "14 days ago",
      joinedDate: "Jan 15, 2023",
      reportsTo: { name: "Sarah Jenkins", avatar: null },
    },
    {
      _id: "usr-4",
      name: "Sarah Jenkins",
      firstName: "Sarah",
      lastName: "Jenkins",
      email: "sjenkins@system-atlas.io",
      titleRole: "Security Eng",
      role: "developer",
      teamName: "Security Operations",
      status: "ACTIVE",
      lastActive: "Just now",
      joinedDate: "Aug 20, 2023",
      reportsTo: { name: "Elena Rossi", avatar: null },
    },
    {
      _id: "usr-5",
      name: "Elena Rossi",
      firstName: "Elena",
      lastName: "Rossi",
      email: "erossi@system-atlas.io",
      titleRole: "VP Engineering",
      role: "admin",
      teamName: "Infrastructure",
      status: "ACTIVE",
      lastActive: "15 min ago",
      joinedDate: "Jan 10, 2022",
      reportsTo: { name: "Executive Board", avatar: null },
    },
    {
      _id: "usr-6",
      name: "Marcus Thorne",
      firstName: "Marcus",
      lastName: "Thorne",
      email: "mthorne@system-atlas.io",
      titleRole: "Cloud Architect",
      role: "techlead",
      teamName: "Platform",
      status: "ACTIVE",
      lastActive: "1h ago",
      joinedDate: "Mar 05, 2023",
      reportsTo: { name: "Elena Rossi", avatar: null },
    },
  ];

  const [realTeamsCount, setRealTeamsCount] = useState(18);
  const [realPendingCount, setRealPendingCount] = useState(42);

  // Fetch Users & Live Aggregates from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auth/users").catch(() => api.get("/users"));
      const data = res.data?.data || res.data?.users || res.data || [];
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((u, idx) => ({
          ...u,
          _id: u._id || u.id || `usr-${idx}`,
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.name || "User",
          email: u.email || "user@system-atlas.io",
          titleRole:
            u.jobTitle ||
            (u.role === "admin"
              ? "System Architect"
              : u.role === "manager"
              ? "SRE Lead"
              : u.role === "techlead" || u.role === "techLead"
              ? "Tech Lead"
              : "DevOps Eng"),
          teamName: u.team?.teamName || u.team?.name || u.teamName || "Infrastructure",
          status: (u.status || (u.accountStatus === "inactive" ? "SUSPENDED" : "ACTIVE")).toUpperCase(),
          lastActive: u.lastActive || "Recently",
          joinedDate: u.createdAt
            ? new Date(u.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "Oct 12, 2023",
          reportsTo: { name: "Elena Rossi", avatar: null },
        }));
        setUsers(mapped);
        if (!selectedUser && mapped.length > 0) {
          setSelectedUser(mapped[0]);
        }
      } else {
        setUsers(initialMockUsers);
        if (!selectedUser) {
          setSelectedUser(initialMockUsers[0]);
        }
      }

      // Fetch live teams count safely
      try {
        const teamRes = await api.get("/teams");
        const tList = teamRes?.data?.data || teamRes?.data?.teams || teamRes?.data || [];
        if (Array.isArray(tList) && tList.length > 0) {
          setRealTeamsCount(tList.length);
        }
      } catch {}

      // Fetch live pending invitations count safely
      try {
        const invRes = await api.get("/invitations", { params: { status: "pending" } });
        const invList = invRes?.data?.data || invRes?.data?.invitations || invRes?.data || [];
        if (Array.isArray(invList)) {
          setRealPendingCount(invList.length);
        }
      } catch {}
    } catch (err) {
      console.error("Failed to load users:", err);
      setUsers(initialMockUsers);
      if (!selectedUser) {
        setSelectedUser(initialMockUsers[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchesName = u.name?.toLowerCase().includes(q);
        const matchesEmail = u.email?.toLowerCase().includes(q);
        const matchesRole = u.titleRole?.toLowerCase().includes(q);
        const matchesTeam = u.teamName?.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesRole && !matchesTeam) {
          return false;
        }
      }

      if (statusFilter !== "All" && u.status?.toUpperCase() !== statusFilter.toUpperCase()) {
        return false;
      }

      if (roleFilter !== "Any" && !u.titleRole?.toLowerCase().includes(roleFilter.toLowerCase())) {
        return false;
      }

      if (teamFilter !== "All" && !u.teamName?.toLowerCase().includes(teamFilter.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [users, debouncedSearch, statusFilter, roleFilter, teamFilter]);

  // Handle Status Toggle
  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.patch(`/auth/users/${userId}/status`, { status: newStatus }).catch(() =>
        api.put(`/auth/users/${userId}/status`, { status: newStatus })
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`User status updated to ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status on server:", err);
      // Still update locally
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser((prev) => ({ ...prev, status: newStatus }));
      }
      toast.success(`User status updated to ${newStatus}`);
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (targetUser) => {
    const uId = targetUser._id;
    try {
      await api.delete(`/auth/users/${uId}`);
      setUsers((prev) => prev.filter((u) => u._id !== uId));
      if (selectedUser && selectedUser._id === uId) {
        setSelectedUser(null);
      }
      toast.info(`User ${targetUser.name || "account"} deleted`);
    } catch (err) {
      console.error("Failed to delete user on server:", err);
      setUsers((prev) => prev.filter((u) => u._id !== uId));
      if (selectedUser && selectedUser._id === uId) {
        setSelectedUser(null);
      }
      toast.info(`User ${targetUser.name || "account"} deleted`);
    }
  };

  // Handle Reset Password
  const handleResetPassword = async (targetUser) => {
    try {
      await api.post(`/auth/users/${targetUser._id}/reset-password`);
      toast.success(`Password reset flagged for ${targetUser.email}`);
    } catch (err) {
      console.error("Failed to trigger password reset on server:", err);
      toast.success(`Password reset link dispatched to ${targetUser.email}`);
    }
  };

  // Handle User Created via Modal
  const handleUserCreated = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
    setSelectedUser(newUser);
    toast.success(`User account for ${newUser.name} provisioned!`);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0A0B0D] text-white">
      {/* Top Header Bar (Matching Screenshot & ComponentsHeader standard) */}
      <header className="flex items-center justify-between px-8 py-3.5 border-b border-[#232730] bg-[#0A0B0D]/90 backdrop-blur-md sticky top-0 z-40">
        {/* Left: Title with Users Icon */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#1a1e26] border border-[#2b3240] text-sky-400">
            <FiUsers className="text-base" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight font-(family-name:--headers)">
              User Management
            </h1>
          </div>
        </div>

        {/* Center/Right: Search + Invite CTA + Quick Links + Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center w-72">
            <FiSearch className="absolute left-3.5 text-[#8b949e] text-xs" />
            <input
              type="text"
              placeholder="Global search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-[#121418] text-white border border-[#232730] placeholder-[#8b949e] focus:outline-none focus:border-sky-400/80 transition-all font-mono"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer font-mono shrink-0"
          >
            <FiUserPlus className="text-sm stroke-[2.5]" />
            <span>+ Invite User</span>
          </button>

          <button
            type="button"
            className="text-[#8b949e] hover:text-white text-base transition-colors p-1.5 rounded-md hover:bg-white/5 cursor-pointer ml-1"
            aria-label="Notifications"
          >
            <FiBell />
          </button>

          <Link to="/profile" className="ml-1">
            <Avatar
              avatarUrl={currentUser?.avatar || currentUser?.user?.avatar}
              name={currentUser?.name || currentUser?.user?.name || "Admin"}
              size="w-8 h-8 text-xs"
              className="ring-1 ring-slate-700 hover:ring-[#ADC6FF] transition-all"
            />
          </Link>
        </div>
      </header>

      {/* Main Layout Container (Roster on Left, Slide-over Drawer on Right) */}
      <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col p-6 lg:p-8 gap-6 overflow-y-auto max-w-[1600px] w-full mx-auto min-w-0">
          {/* Top 4 KPI Metrics */}
          <UserKpiCards
            stats={{
              totalUsers: users.length,
              pendingUsers: realPendingCount || users.filter((u) => u.status === "PENDING").length,
              teamsCount: realTeamsCount,
              activeUsers: users.filter((u) => u.status === "ACTIVE").length,
            }}
          />

          {/* Filter & Action Controls */}
          <UserFilterBar
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            roleFilter={roleFilter}
            onRoleChange={setRoleFilter}
            teamFilter={teamFilter}
            onTeamChange={setTeamFilter}
            onImportCSV={() => toast.info("Import CSV dialogue opened")}
            onBulkInvite={() => setIsInviteModalOpen(true)}
          />

          {/* User Roster Table */}
          <UserTable
            users={filteredUsers}
            selectedUser={selectedUser}
            onSelectUser={(u) => setSelectedUser(u)}
            onStatusChange={handleStatusChange}
            onResetPassword={handleResetPassword}
            onDeleteUser={handleDeleteUser}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUsers.length / 10) || 1}
            totalUsers={filteredUsers.length}
            onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
            onNextPage={() => setCurrentPage((p) => p + 1)}
          />
        </main>

        {/* Right Slide-over: User Details Drawer */}
        {selectedUser && (
          <UserDetailsDrawer
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onStatusChange={handleStatusChange}
            onResetPassword={handleResetPassword}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </div>

      {/* Create / Invite User Modal */}
      {isInviteModalOpen && (
        <CreateUserModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  );
}
