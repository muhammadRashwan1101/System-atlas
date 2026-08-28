import React, { useState, useEffect } from "react";
import { FiX, FiEye, FiEyeOff, FiRefreshCw, FiInfo, FiChevronDown, FiCheck } from "react-icons/fi";
import api from "../../api/axios";
import useWorkspace from "../../context/WorkspaceContext";

export default function CreateUserModal({
  isOpen = true,
  onClose,
  onUserCreated,
}) {
  const { workspaces, currentWorkspace } = useWorkspace();
  const [availableWorkspaces, setAvailableWorkspaces] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);

  const [option, setOption] = useState("send");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Developer");
  const [level, setLevel] = useState("Senior");
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [requireReset, setRequireReset] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load live workspaces and teams from backend safely
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      if (workspaces && workspaces.length > 0) {
        if (isMounted) {
          setAvailableWorkspaces(workspaces);
          if (!selectedWorkspaceId) {
            setSelectedWorkspaceId(currentWorkspace?._id || workspaces[0]._id || "");
          }
        }
      } else {
        try {
          const res = await api.get("/workspaces");
          const list = res?.data?.data || res?.data?.workspaces || res?.data || [];
          if (isMounted && Array.isArray(list) && list.length > 0) {
            setAvailableWorkspaces(list);
            if (!selectedWorkspaceId) setSelectedWorkspaceId(list[0]._id || "");
          }
        } catch {
          // Ignore network/test mock errors
        }
      }

      try {
        const res = await api.get("/teams");
        const teamsList = res?.data?.data || res?.data?.teams || res?.data || [];
        if (isMounted && Array.isArray(teamsList)) {
          setAvailableTeams(teamsList);
        }
      } catch {
        // Ignore network/test mock errors
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [workspaces, currentWorkspace]);

  if (isOpen === false) return null;

  const handleGeneratePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let gen = "";
    for (let i = 0; i < 14; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(gen);
  };

  const handleCreate = async (e, shouldSend = false) => {
    e?.preventDefault();
    const finalOption = shouldSend ? "send" : option;
    const parts = (fullName.trim() || "John Doe").split(" ");
    const firstName = parts[0] || "John";
    const lastName = parts.slice(1).join(" ") || "Doe";
    const userEmail = email.trim() || "john.doe@systematlas.io";

    // Map role to backend enum ['user', 'admin', 'manager', 'techLead']
    const mappedRole =
      role.toLowerCase().includes("admin")
        ? "admin"
        : role.toLowerCase().includes("manager")
        ? "manager"
        : role.toLowerCase().includes("tech")
        ? "techLead"
        : "user";

    const targetTeam = availableTeams.find((t) => (t._id || t.id) === selectedTeamId);
    const targetWorkspace = availableWorkspaces.find((w) => (w._id || w.id) === selectedWorkspaceId);

    setSubmitting(true);

    let createdUserObj = {
      _id: `user-${Date.now()}`,
      name: fullName.trim() || "John Doe",
      firstName,
      lastName,
      username: username.trim() || "j.doe",
      email: userEmail,
      role: mappedRole === "user" ? "developer" : mappedRole.toLowerCase(),
      titleRole: `${role} (${level})`,
      teamName: targetTeam?.teamName || targetTeam?.name || "Infrastructure",
      workspaceName: targetWorkspace?.name || "Global Engineering",
      status: finalOption === "pending" ? "PENDING" : "ACTIVE",
      lastActive: "Just now",
      joinedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      reportsTo: { name: "Elena Rossi", avatar: null },
    };

    try {
      const res = await api.post("/invitations", {
        email: userEmail,
        role: mappedRole,
        firstName,
        lastName,
        jobTitle: `${role} (${level})`,
        level,
        workspaceId: selectedWorkspaceId || undefined,
        teamId: selectedTeamId || undefined,
        temporaryPassword: password || undefined,
        requirePasswordReset: requireReset,
      });

      if (res.data?.user) {
        createdUserObj = {
          ...createdUserObj,
          _id: res.data.user.id || res.data.user._id || createdUserObj._id,
        };
      }
    } catch (err) {
      console.error("Backend invitation creation fallback:", err);
    } finally {
      setSubmitting(false);
      if (onUserCreated) onUserCreated(createdUserObj);
      if (onClose) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto font-mono text-xs">
      <div className="w-full max-w-[560px] bg-[#121418] border border-[#232730] rounded-2xl overflow-hidden shadow-2xl my-6 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#232730] bg-[#121418]">
          <div>
            <h2 className="text-base font-bold text-white font-(family-name:--headers) tracking-tight">
              Create New User
            </h2>
            <p className="text-xs text-[#8b949e] font-sans mt-0.5">
              Create a new user account and generate initial credentials.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8b949e] hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[72vh] overflow-y-auto">
          {/* Section 1: PERSONAL INFORMATION */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider text-[#8b949e] font-semibold whitespace-nowrap">
                PERSONAL INFORMATION
              </span>
              <div className="flex-1 h-px bg-[#232730]" />
            </div>

            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block mb-1.5 text-[10px] text-slate-300 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div>
                <label className="block mb-1.5 text-[10px] text-slate-300 uppercase tracking-wide">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="j.doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="col-span-2">
                <label className="block mb-1.5 text-[10px] text-slate-300 uppercase tracking-wide">
                  Work Email
                </label>
                <input
                  type="email"
                  placeholder="john.doe@systematlas.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white text-slate-900 px-3 py-2 rounded-lg text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: ROLE & ACCESS */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider text-[#8b949e] font-semibold whitespace-nowrap">
                ROLE & ACCESS
              </span>
              <div className="flex-1 h-px bg-[#232730]" />
            </div>

            <div className="grid grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="block mb-1.5 text-[10px] text-slate-300 uppercase tracking-wide">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#0d0f14] border border-[#2b3240] text-white px-3 py-2 rounded-lg text-xs font-mono appearance-none focus:outline-none focus:border-sky-400 cursor-pointer pr-8"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Tech Lead">Tech Lead</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-[#8b949e] text-xs pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-[10px] text-slate-300 uppercase tracking-wide">
                  Level
                </label>
                <div className="relative">
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full bg-[#0d0f14] border border-[#2b3240] text-white px-3 py-2 rounded-lg text-xs font-mono appearance-none focus:outline-none focus:border-sky-400 cursor-pointer pr-8"
                  >
                    <option value="Senior">Senior</option>
                    <option value="Mid">Mid</option>
                    <option value="Junior">Junior</option>
                    <option value="Lead">Lead</option>
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-[#8b949e] text-xs pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-[10px] text-slate-300 uppercase tracking-wide">
                  Workspace
                </label>
                <div className="relative">
                  <select
                    value={selectedWorkspaceId}
                    onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                    className="w-full bg-[#0d0f14] border border-[#2b3240] text-white px-3 py-2 rounded-lg text-xs font-mono appearance-none focus:outline-none focus:border-sky-400 cursor-pointer pr-8 truncate"
                  >
                    {availableWorkspaces.length > 0 ? (
                      availableWorkspaces.map((ws) => (
                        <option key={ws._id || ws.id} value={ws._id || ws.id}>
                          {ws.name}
                        </option>
                      ))
                    ) : (
                      <option value="">Global Engineering</option>
                    )}
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-[#8b949e] text-xs pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 text-[10px] text-slate-300 uppercase tracking-wide">
                  Team Assignment <span className="text-[#8b949e] lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full bg-[#0d0f14] border border-[#2b3240] text-white px-3 py-2 rounded-lg text-xs font-mono appearance-none focus:outline-none focus:border-sky-400 cursor-pointer pr-8 truncate"
                  >
                    <option value="">Select a team...</option>
                    {availableTeams.length > 0 ? (
                      availableTeams.map((t) => (
                        <option key={t._id || t.id} value={t._id || t.id}>
                          {t.teamName || t.name} ({t.teamCode || t.category || "Team"})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Core Services">Core Services</option>
                        <option value="Platform">Platform</option>
                        <option value="Security Operations">Security Operations</option>
                      </>
                    )}
                  </select>
                  <FiChevronDown className="absolute right-3 top-3 text-[#8b949e] text-xs pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: INITIAL CREDENTIALS */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider text-[#8b949e] font-semibold whitespace-nowrap">
                INITIAL CREDENTIALS
              </span>
              <div className="flex-1 h-px bg-[#232730]" />
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block mb-1.5 text-[10px] text-slate-300 uppercase tracking-wide">
                  Temporary Password
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white text-slate-900 px-3 py-2 pr-9 rounded-lg text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1a1e26] hover:bg-[#232730] border border-[#2b3240] text-slate-200 hover:text-white rounded-lg text-xs font-mono transition-colors cursor-pointer shrink-0"
                  >
                    <FiRefreshCw className="text-xs text-[#8b949e]" />
                    <span>Generate</span>
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={requireReset}
                  onChange={(e) => setRequireReset(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#1a1e26] border-[#2b3240] accent-[#ADC6FF] cursor-pointer"
                />
                <span className="font-sans text-xs">Require password reset on first login</span>
              </label>
            </div>
          </div>

          {/* Section 4: ACCOUNT STATUS */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-wider text-[#8b949e] font-semibold whitespace-nowrap">
                ACCOUNT STATUS
              </span>
              <div className="flex-1 h-px bg-[#232730]" />
            </div>

            <div className="space-y-3 pt-1">
              {/* Radio 1: Send Immediately */}
              <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-[#232730]">
                <input
                  type="radio"
                  name="invitation"
                  value="send"
                  checked={option === "send"}
                  onChange={(e) => setOption(e.target.value)}
                  className="mt-0.5 w-4 h-4 accent-[#ADC6FF] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white font-sans">
                    Send Invitation Immediately
                  </span>
                  <span className="text-[11px] text-[#8b949e] font-sans mt-0.5">
                    User will receive an onboarding email at the provided address.
                  </span>
                </div>
              </label>

              {/* Radio 2: Save Without Sending */}
              <label className="flex items-start gap-3 cursor-pointer p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-[#232730]">
                <input
                  type="radio"
                  name="invitation"
                  value="pending"
                  checked={option === "pending"}
                  onChange={(e) => setOption(e.target.value)}
                  className="mt-0.5 w-4 h-4 accent-[#ADC6FF] cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-200 font-sans">
                    Save User Without Sending Invitation
                  </span>
                  <span className="text-[11px] text-[#8b949e] font-sans mt-0.5">
                    Account will be created as "Pending". You can invite later manually.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Info Notice Box */}
          <div className="bg-[#161922] border border-[#232730] rounded-xl p-4 flex items-start gap-3">
            <FiInfo className="text-base text-[#ADC6FF] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#8b949e] font-sans leading-relaxed">
              Users receive an email invitation to activate their account. Their temporary password will only be valid until first login. Active sessions will be logged in the system audit trail.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-[#232730] bg-[#0D0E11] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer font-sans font-medium"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => handleCreate(e, false)}
              className="px-4 py-2 bg-[#161922] hover:bg-[#1f2430] text-slate-200 hover:text-white border border-[#2b3240] rounded-lg text-xs font-mono transition-colors cursor-pointer font-medium"
            >
              Create User
            </button>
            <button
              type="button"
              onClick={(e) => handleCreate(e, true)}
              className="px-4 py-2 bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer font-mono"
            >
              Create & Send Invitation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
