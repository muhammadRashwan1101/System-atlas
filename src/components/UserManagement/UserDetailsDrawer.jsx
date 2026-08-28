import React, { useState, useEffect } from "react";
import {
  FiX,
  FiChevronRight,
  FiKey,
  FiSlash,
  FiTrash2,
  FiCode,
  FiBox,
  FiFolder,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import Avatar from "../Utils/Avatar";
import api from "../../api/axios";
import useWorkspace from "../../context/WorkspaceContext";

export default function UserDetailsDrawer({
  user = null,
  onClose,
  onStatusChange,
  onResetPassword,
  onDeleteUser,
}) {
  const { currentWorkspace } = useWorkspace();
  const [userProjects, setUserProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const [permissions, setPermissions] = useState({
    editTopology: true,
    manageBilling: false,
    accessAuditLogs: true,
  });

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    const wsId = currentWorkspace?._id || user.workspaceId;

    if (wsId) {
      setLoadingProjects(true);
      api
        .get(`/workspaces/${wsId}/projects`)
        .then((res) => {
          if (!isMounted) return;
          const projects = res.data?.data || res.data?.projects || res.data || [];
          if (Array.isArray(projects)) {
            // Find projects owned by this user or matching their team
            const relevant = projects.filter(
              (p) =>
                p.ownerId === user._id ||
                p.ownerId?._id === user._id ||
                p.managerName?.toLowerCase() === (user.name || "").toLowerCase()
            );
            setUserProjects(relevant.length > 0 ? relevant : projects.slice(0, 2));
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setLoadingProjects(false);
        });
    }

    // Set permission states according to user role
    const isAdmin = user.role === "admin";
    const isManager = user.role === "manager";
    setPermissions({
      editTopology: isAdmin || isManager,
      manageBilling: isAdmin,
      accessAuditLogs: isAdmin || isManager,
    });

    return () => {
      isMounted = false;
    };
  }, [user, currentWorkspace]);

  if (!user) return null;

  const userName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.name ||
    "Alex Rivera";
  const userEmail = user.email || "arivera@system-atlas.io";
  const userRole =
    user.titleRole ||
    user.roleTitle ||
    (user.role === "admin"
      ? "System Architect"
      : user.role === "manager"
      ? "SRE Lead"
      : "DevOps Eng");
  const userTeam =
    user.teamName ||
    (typeof user.team === "object" ? user.team?.name : user.team) ||
    "Infrastructure (London)";
  const userStatus = user.status || "ACTIVE";
  const joinedDate = user.joinedDate || "Oct 12, 2023";
  const reportsTo = user.reportsTo || { name: "Elena Rossi", avatar: null };

  const togglePermission = (key) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-full lg:w-[420px] bg-[#0E1017] border-l border-[#232730] h-full flex flex-col justify-between shrink-0 shadow-2xl overflow-y-auto font-mono text-xs z-30">
      <div className="flex flex-col">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#232730] bg-[#0A0B0D]">
          <h2 className="text-base font-bold text-white font-(family-name:--headers)">
            User Details
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close user details"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Profile Card Summary */}
        <div className="p-6 border-b border-[#232730] flex items-center gap-4">
          <Avatar
            avatarUrl={user.avatar}
            name={userName}
            size="w-14 h-14 text-sm"
            className="rounded-xl ring-2 ring-[#2b3240] shrink-0"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <h3 className="text-base font-bold text-white font-(family-name:--headers) truncate">
              {userName}
            </h3>
            <span className="text-[11px] text-[#8b949e] font-mono truncate">
              {userEmail}
            </span>
            <div className="mt-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                  userStatus === "SUSPENDED"
                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    : userStatus === "PENDING"
                    ? "bg-slate-500/10 text-slate-300 border-slate-600/40"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    userStatus === "SUSPENDED"
                      ? "bg-rose-400"
                      : userStatus === "PENDING"
                      ? "bg-slate-400"
                      : "bg-emerald-400"
                  }`}
                />
                {userStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Organization Section */}
        <div className="p-6 border-b border-[#232730] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#8b949e] font-semibold text-[10px] tracking-wider uppercase">
            <span className="text-slate-400">ORGANIZATION</span>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-3 text-xs">
            <div>
              <span className="text-[#8b949e] text-[10px] uppercase block mb-1">
                ROLE
              </span>
              <span className="text-white font-medium">{userRole}</span>
            </div>

            <div>
              <span className="text-[#8b949e] text-[10px] uppercase block mb-1">
                TEAM
              </span>
              <span className="text-white font-medium">{userTeam}</span>
            </div>

            <div>
              <span className="text-[#8b949e] text-[10px] uppercase block mb-1">
                JOINED
              </span>
              <span className="text-white font-medium">{joinedDate}</span>
            </div>

            <div>
              <span className="text-[#8b949e] text-[10px] uppercase block mb-1">
                REPORTS TO
              </span>
              <div className="flex items-center gap-1.5 text-white font-medium truncate">
                <Avatar
                  name={typeof reportsTo === "string" ? reportsTo : reportsTo.name}
                  size="w-4 h-4 text-[9px]"
                  className="rounded-full ring-1 ring-[#2b3240] shrink-0"
                />
                <span className="truncate">
                  {typeof reportsTo === "string" ? reportsTo : reportsTo.name}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects & Permissions Section */}
        <div className="p-6 border-b border-[#232730] flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#8b949e] font-semibold text-[10px] tracking-wider uppercase">
            <span className="text-slate-400">PROJECTS & PERMISSIONS</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {userProjects.length > 0 ? (
              userProjects.map((p, idx) => (
                <div
                  key={p._id || p.id || idx}
                  className="p-3 bg-[#121418] border border-[#232730] hover:border-[#2b3240] rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg border ${
                        idx % 2 === 0
                          ? "bg-[#1a1e26] border-[#2b3240] text-sky-400"
                          : "bg-[#1a1e26] border-[#2b3240] text-emerald-400"
                      }`}
                    >
                      {idx % 2 === 0 ? <FiCode className="text-sm" /> : <FiBox className="text-sm" />}
                    </div>
                    <div>
                      <span className="text-white font-semibold block text-xs font-(family-name:--headers)">
                        {p.name || "Internal Core Engine"}
                      </span>
                      <span className="text-[10px] text-[#8b949e] block font-mono">
                        {p.targetEnvironment || (idx === 0 ? "Full Write Access" : "Maintainer")}
                      </span>
                    </div>
                  </div>
                  <FiChevronRight className="text-[#8b949e] text-sm" />
                </div>
              ))
            ) : (
              <>
                {/* Project Card 1 */}
                <div className="p-3 bg-[#121418] border border-[#232730] hover:border-[#2b3240] rounded-xl flex items-center justify-between transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1a1e26] border border-[#2b3240] text-sky-400">
                      <FiCode className="text-sm" />
                    </div>
                    <div>
                      <span className="text-white font-semibold block text-xs font-(family-name:--headers)">
                        Internal Core Engine
                      </span>
                      <span className="text-[10px] text-[#8b949e] block font-mono">
                        Full Write Access
                      </span>
                    </div>
                  </div>
                  <FiChevronRight className="text-[#8b949e] text-sm" />
                </div>

                {/* Project Card 2 */}
                <div className="p-3 bg-[#121418] border border-[#232730] hover:border-[#2b3240] rounded-xl flex items-center justify-between transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#1a1e26] border border-[#2b3240] text-emerald-400">
                      <FiBox className="text-sm" />
                    </div>
                    <div>
                      <span className="text-white font-semibold block text-xs font-(family-name:--headers)">
                        Terraform Modules
                      </span>
                      <span className="text-[10px] text-[#8b949e] block font-mono">
                        Maintainer
                      </span>
                    </div>
                  </div>
                  <FiChevronRight className="text-[#8b949e] text-sm" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Workspace Permissions Toggles */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#8b949e] font-semibold text-[10px] tracking-wider uppercase">
            <span className="text-slate-400">WORKSPACE PERMISSIONS</span>
          </div>

          <div className="flex flex-col gap-3.5">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between">
              <span className="text-slate-200 text-xs font-sans">
                Edit System Topology
              </span>
              <button
                type="button"
                onClick={() => togglePermission("editTopology")}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  permissions.editTopology ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    permissions.editTopology ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between">
              <span className="text-slate-200 text-xs font-sans">
                Manage Billing & Subscriptions
              </span>
              <button
                type="button"
                onClick={() => togglePermission("manageBilling")}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  permissions.manageBilling ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    permissions.manageBilling ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between">
              <span className="text-slate-200 text-xs font-sans">
                Access Security Audit Logs
              </span>
              <button
                type="button"
                onClick={() => togglePermission("accessAuditLogs")}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                  permissions.accessAuditLogs ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    permissions.accessAuditLogs ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-6 border-t border-[#232730] bg-[#0A0B0D] flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onResetPassword && onResetPassword(user)}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#121418] hover:bg-[#1a1e26] text-slate-300 hover:text-white border border-[#232730] transition-colors cursor-pointer text-xs"
          >
            <FiKey className="text-xs text-[#8b949e]" />
            <span>Reset Password</span>
          </button>

          <button
            type="button"
            onClick={() =>
              onStatusChange &&
              onStatusChange(
                user._id,
                userStatus === "SUSPENDED" ? "ACTIVE" : "SUSPENDED"
              )
            }
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#121418] hover:bg-[#1a1e26] text-slate-300 hover:text-white border border-[#232730] transition-colors cursor-pointer text-xs"
          >
            <FiSlash className="text-xs text-[#8b949e]" />
            <span>{userStatus === "SUSPENDED" ? "Activate" : "Suspend"}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onDeleteUser && onDeleteUser(user)}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer text-xs font-semibold uppercase tracking-wider"
        >
          <FiTrash2 className="text-xs text-rose-400" />
          <span>Delete User</span>
        </button>
      </div>
    </aside>
  );
}
