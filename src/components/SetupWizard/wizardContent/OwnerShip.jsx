import { useState, useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiUsers,
  FiUserCheck,
  FiSearch,
  FiCheck,
  FiX,
  FiShield,
  FiHash,
} from "react-icons/fi";
import {
  MdOutlineRocketLaunch,
  MdOutlineLayers,
  MdTerminal,
} from "react-icons/md";
import { BiBuilding } from "react-icons/bi";
import api from "../../../api/axios";
import useWizard from "../../../context/WizardContext";

const ENVIRONMENT_OPTIONS = [
  {
    id: "development",
    value: "development",
    label: "Development",
    description: "Internal testing, sandbox & active dev",
    icon: MdTerminal,
  },
  {
    id: "staging",
    value: "staging",
    label: "Staging",
    description: "Pre-production verification & QA mirror",
    icon: MdOutlineLayers,
  },
  {
    id: "production",
    value: "production",
    label: "Production",
    description: "Live customer-facing environment",
    icon: MdOutlineRocketLaunch,
  },
];

export default function OwnerShip() {
  const { projectId } = useParams();
  const { data, updateStepData, setCurrentStep, wizardId } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Ownership mode: "team" (select existing team) vs "refCode" (use reference code) - mutually exclusive
  const initialOwnership = data?.ownership || {};
  const [ownershipMode, setOwnershipMode] = useState(
    initialOwnership.ownerRefCode ? "refCode" : "team"
  );

  // Teams list state
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamSearchQuery, setTeamSearchQuery] = useState("");
  const [isTeamDropdownOpen, setIsTeamDropdownOpen] = useState(false);
  const teamDropdownRef = useRef(null);

  // Tech Lead Search State
  const [leadQuery, setLeadQuery] = useState("");
  const [leadsList, setLeadsList] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [isLeadDropdownOpen, setIsLeadDropdownOpen] = useState(false);
  const leadDropdownRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      ownerTeam: initialOwnership.ownerTeam || null,
      ownerRefCode: initialOwnership.ownerRefCode || "",
      technicalLead: initialOwnership.technicalLead || null,
      maintainers: initialOwnership.maintainers || [],
      environment: initialOwnership.environment || "development",
    },
  });

  const watchedTeamId = useWatch({ control, name: "ownerTeam" });
  const watchedRefCode = useWatch({ control, name: "ownerRefCode" });
  const watchedLeadId = useWatch({ control, name: "technicalLead" });
  const rawMaintainers = useWatch({ control, name: "maintainers" });
  const watchedMaintainers = useMemo(
    () => (Array.isArray(rawMaintainers) ? rawMaintainers : []),
    [rawMaintainers]
  );
  const watchedEnvironment = useWatch({ control, name: "environment" }) || "development";

  // Fetch Teams
  useEffect(() => {
    let isMounted = true;
    const fetchTeams = async () => {
      setTeamsLoading(true);
      try {
        const res = await api.get("/teams");
        const teamData = res.data?.data || res.data?.teams || res.data || [];
        if (isMounted) {
          setTeams(Array.isArray(teamData) ? teamData : []);
        }
      } catch (err) {
        console.error("Failed to load teams:", err);
      } finally {
        if (isMounted) setTeamsLoading(false);
      }
    };
    fetchTeams();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Team Leads with debounce
  useEffect(() => {
    const controller = new AbortController();
    const fetchLeads = async () => {
      setLeadsLoading(true);
      try {
        const res = await api.get(
          `/team-leads/search?name=${encodeURIComponent(leadQuery)}`,
          { signal: controller.signal }
        );
        const results = res.data?.data || res.data || [];
        setLeadsList(Array.isArray(results) ? results : []);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Failed to search team leads:", err);
        }
      } finally {
        setLeadsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchLeads();
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [leadQuery]);

  // Handle outside clicks for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        teamDropdownRef.current &&
        !teamDropdownRef.current.contains(e.target)
      ) {
        setIsTeamDropdownOpen(false);
      }
      if (
        leadDropdownRef.current &&
        !leadDropdownRef.current.contains(e.target)
      ) {
        setIsLeadDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Selected team object
  const selectedTeam = useMemo(() => {
    if (!watchedTeamId) return null;
    return teams.find((t) => t._id === watchedTeamId) || null;
  }, [watchedTeamId, teams]);

  // Selected tech lead object
  const selectedLead = useMemo(() => {
    if (!watchedLeadId) return null;
    return (
      leadsList.find((l) => l._id === watchedLeadId) ||
      (selectedTeam?.teamLead?._id === watchedLeadId
        ? selectedTeam.teamLead
        : null) ||
      null
    );
  }, [watchedLeadId, leadsList, selectedTeam]);

  // Filtered teams list based on search
  const filteredTeams = useMemo(() => {
    const q = teamSearchQuery.trim().toLowerCase();
    if (!q) return teams;
    return teams.filter(
      (t) =>
        (t.teamName || t.name || "").toLowerCase().includes(q) ||
        (t.teamCode || t.refCode || "").toLowerCase().includes(q)
    );
  }, [teams, teamSearchQuery]);

  // Sync live state with ComponentPreview
  useEffect(() => {
    const teamNameOrCode =
      ownershipMode === "team"
        ? selectedTeam?.teamName || selectedTeam?.name || "Unassigned"
        : watchedRefCode?.trim() || "Unassigned";

    const leadName = selectedLead
      ? `${selectedLead.firstName || ""} ${selectedLead.lastName || ""}`.trim() ||
        selectedLead.name ||
        selectedLead.email
      : "Unassigned";

    updateStepData("ownership", {
      ownerTeam: ownershipMode === "team" ? watchedTeamId : null,
      ownerRefCode: ownershipMode === "refCode" ? watchedRefCode : "",
      technicalLead: watchedLeadId,
      maintainers: watchedMaintainers,
      environment: watchedEnvironment,
    });

    updateStepData("basicInfo", {
      ownerTeam: teamNameOrCode,
      environment: watchedEnvironment,
      technicalLead: leadName,
    });
  }, [
    ownershipMode,
    watchedTeamId,
    watchedRefCode,
    watchedLeadId,
    watchedMaintainers,
    watchedEnvironment,
    selectedTeam,
    selectedLead,
    updateStepData,
  ]);

  const handleModeChange = (mode) => {
    setOwnershipMode(mode);
    if (mode === "team") {
      setValue("ownerRefCode", "", { shouldValidate: true });
    } else {
      setValue("ownerTeam", null, { shouldValidate: true });
    }
  };

  const handleTeamSelect = (team) => {
    setValue("ownerTeam", team._id, { shouldValidate: true });
    setValue("ownerRefCode", "", { shouldValidate: true });
    setIsTeamDropdownOpen(false);

    // Auto-populate tech lead if available and not yet selected
    if (team.teamLead && !watchedLeadId) {
      const leadId =
        typeof team.teamLead === "object" ? team.teamLead._id : team.teamLead;
      setValue("technicalLead", leadId, { shouldValidate: true });
    }

    // Auto-populate maintainers from team members if empty
    if (Array.isArray(team.members) && team.members.length > 0 && watchedMaintainers.length === 0) {
      const memberIds = team.members.map((m) =>
        typeof m === "object" ? m._id : m
      );
      setValue("maintainers", memberIds, { shouldValidate: true });
    }
  };

  const handleLeadSelect = (lead) => {
    setValue("technicalLead", lead._id, { shouldValidate: true });
    setIsLeadDropdownOpen(false);
    setLeadQuery("");
  };

  const handleRemoveLead = () => {
    setValue("technicalLead", null, { shouldValidate: true });
  };

  const toggleMaintainer = (memberId) => {
    let updated;
    if (watchedMaintainers.includes(memberId)) {
      updated = watchedMaintainers.filter((id) => id !== memberId);
    } else {
      updated = [...watchedMaintainers, memberId];
    }
    setValue("maintainers", updated, { shouldValidate: true });
  };

  const onSubmit = async (formData) => {
    if (isSubmitting) return;

    if (ownershipMode === "team" && !formData.ownerTeam) {
      toast.error("Please select an owner team");
      return;
    }

    if (ownershipMode === "refCode" && !formData.ownerRefCode?.trim()) {
      toast.error("Please enter a team reference code");
      return;
    }

    if (!formData.environment) {
      toast.error("Please select a deployment environment");
      return;
    }

    if (!wizardId) {
      toast.error("Wizard session not found. Please start from Step 1.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      ownerTeam: ownershipMode === "team" ? formData.ownerTeam : null,
      ownerRefCode:
        ownershipMode === "refCode"
          ? (formData.ownerRefCode || "").trim()
          : undefined,
      technicalLead: formData.technicalLead || null,
      maintainers: formData.maintainers || [],
      environment: formData.environment,
    };

    try {
      const endpoint = `/projects/${projectId}/wizard/${wizardId}`;
      const response = await api.patch(endpoint, payload);

      toast.success(
        response.data?.msg ||
          response.data?.message ||
          "Ownership saved successfully"
      );

      const responseData =
        response.data?.currentWizard ||
        response.data?.wizard ||
        response.data;
      const nextStep =
        responseData?.currentStep || response.data?.nextStep || "documentation";

      updateStepData("ownership", payload);

      // Transition to backend-returned currentStep
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    } catch (err) {
      const message =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save ownership details. Please try again.";

      const displayMessage = Array.isArray(message)
        ? message.join(", ")
        : typeof message === "object"
        ? JSON.stringify(message)
        : message;

      setSubmitError(displayMessage);
      toast.error(displayMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#131519] border border-[#44474F30] rounded-xl p-6 w-full shadow-lg">
      <form
        id="wizard-step-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-(family-name:--headers) text-xl font-semibold text-white">
              Component Ownership & Environment
            </h2>
            <span className="px-2.5 py-1 text-[11px] font-(family-name:--labels) uppercase tracking-wider rounded-md border border-sky-400/30 bg-sky-500/10 text-sky-300">
              Governance
            </span>
          </div>
          <p className="text-xs text-(--text)/70 font-light leading-relaxed">
            Assign the responsible team, designated technical lead, maintainers,
            and primary target environment for this component.
          </p>
        </div>

        {submitError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 leading-relaxed">
            {submitError}
          </div>
        )}

        {/* Mutually Exclusive Owner Selection Mode */}
        <div className="flex flex-col gap-3">
          <label className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider">
            <FiUsers className="text-base" />
            Team Ownership Mode <span className="text-red-400">*</span>
          </label>

          <div className="grid grid-cols-2 p-1 rounded-lg bg-[#0D0E11] border border-(--border)/40">
            <button
              type="button"
              onClick={() => handleModeChange("team")}
              className={`py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                ownershipMode === "team"
                  ? "bg-sky-500/20 text-white border border-sky-400/40 shadow-sm"
                  : "text-(--text)/70 hover:text-white"
              }`}
            >
              <BiBuilding className="text-sm" />
              Existing Team
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("refCode")}
              className={`py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                ownershipMode === "refCode"
                  ? "bg-sky-500/20 text-white border border-sky-400/40 shadow-sm"
                  : "text-(--text)/70 hover:text-white"
              }`}
            >
              <FiHash className="text-sm" />
              Team Reference Code
            </button>
          </div>
        </div>

        {/* Mode 1: Existing Team Dropdown Selector */}
        {ownershipMode === "team" && (
          <div className="flex flex-col gap-2 relative" ref={teamDropdownRef}>
            <label className="flex gap-1.5 items-center text-(--text)/80 font-(family-name:--labels) text-xs">
              Select Owner Team <span className="text-red-400">*</span>
            </label>

            <button
              type="button"
              onClick={() => setIsTeamDropdownOpen(!isTeamDropdownOpen)}
              className="w-full p-3 rounded-lg bg-[#0D0E11] text-white border border-(--border)/40 flex items-center justify-between text-xs cursor-pointer hover:border-sky-400/60 transition-colors"
            >
              {selectedTeam ? (
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-xs">
                    {(selectedTeam.teamName || selectedTeam.name || "T")[0]}
                  </div>
                  <span className="font-medium">
                    {selectedTeam.teamName || selectedTeam.name}
                  </span>
                  {(selectedTeam.teamCode || selectedTeam.refCode) && (
                    <span className="text-[10px] text-(--text)/50 px-1.5 py-0.5 rounded bg-white/5 font-mono">
                      {selectedTeam.teamCode || selectedTeam.refCode}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-(--text)/50">
                  {teamsLoading ? "Loading teams..." : "Choose a team..."}
                </span>
              )}
              <FiSearch className="text-sm text-(--text)/50" />
            </button>

            {isTeamDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-full bg-[#131519] border border-(--border)/60 rounded-lg shadow-2xl z-30 overflow-hidden animate-fadeIn">
                <div className="p-2 border-b border-(--border)/30">
                  <div className="relative flex items-center">
                    <FiSearch className="absolute left-2.5 text-(--text)/40 text-xs" />
                    <input
                      type="text"
                      placeholder="Search teams by name or code..."
                      value={teamSearchQuery}
                      onChange={(e) => setTeamSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded bg-[#0D0E11] text-white border border-(--border)/30 focus:outline-none focus:border-sky-400"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto p-1.5 flex flex-col gap-1">
                  {filteredTeams.map((team) => {
                    const isSelected = team._id === watchedTeamId;
                    return (
                      <button
                        key={team._id}
                        type="button"
                        onClick={() => handleTeamSelect(team)}
                        className={`w-full p-2 rounded-md flex items-center justify-between text-xs cursor-pointer transition-colors text-left ${
                          isSelected
                            ? "bg-sky-500/15 text-white border border-sky-400/40"
                            : "hover:bg-white/5 text-(--text)/90"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center text-[10px] text-sky-300 font-bold">
                            {(team.teamName || team.name || "T")[0]}
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {team.teamName || team.name}
                            </p>
                            {(team.teamCode || team.refCode) && (
                              <span className="text-[10px] text-(--text)/50 font-mono">
                                Code: {team.teamCode || team.refCode}
                              </span>
                            )}
                          </div>
                        </div>
                        {isSelected && <FiCheck className="text-sky-400" />}
                      </button>
                    );
                  })}
                  {filteredTeams.length === 0 && (
                    <div className="p-3 text-center text-xs text-(--text)/50">
                      No teams found matching search.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Team Reference Code Input */}
        {ownershipMode === "refCode" && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="ownerRefCode"
              className="flex gap-1.5 items-center text-(--text)/80 font-(family-name:--labels) text-xs"
            >
              Team Reference Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="ownerRefCode"
              placeholder="e.g. TEAM-CORE-01"
              {...register("ownerRefCode", {
                required:
                  ownershipMode === "refCode"
                    ? "Team reference code is required"
                    : false,
              })}
              className="p-3 rounded-lg bg-[#0D0E11] text-white border border-(--border)/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:border-sky-400 transition-all duration-200 text-xs font-mono"
            />
            {errors.ownerRefCode && (
              <p className="text-red-400 text-xs">
                {errors.ownerRefCode.message}
              </p>
            )}
            <p className="text-[11px] text-(--text)/50 font-light italic">
              Use a standardized alphanumeric department code or identifier.
            </p>
          </div>
        )}

        {/* Technical Lead Selector */}
        <div className="flex flex-col gap-2 relative" ref={leadDropdownRef}>
          <label className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider">
            <FiUserCheck className="text-base" />
            Technical Lead (Optional)
          </label>

          {selectedLead ? (
            <div className="p-3 rounded-lg bg-[#0D0E11] border border-(--border)/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center font-bold text-sky-300 text-xs">
                  {(selectedLead.firstName || selectedLead.name || "L")[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-xs font-medium">
                    {`${selectedLead.firstName || ""} ${
                      selectedLead.lastName || ""
                    }`.trim() || selectedLead.name}
                  </span>
                  <span className="text-[10px] text-(--text)/50">
                    {selectedLead.email || "Designated Tech Lead"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveLead}
                className="p-1 rounded text-(--text)/50 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                title="Remove Lead"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsLeadDropdownOpen(!isLeadDropdownOpen)}
              className="w-full p-3 rounded-lg bg-[#0D0E11] text-(--text)/50 border border-(--border)/40 flex items-center justify-between text-xs cursor-pointer hover:border-sky-400/60 transition-colors"
            >
              <span>Select or search technical lead...</span>
              <FiSearch className="text-sm text-(--text)/50" />
            </button>
          )}

          {isLeadDropdownOpen && !selectedLead && (
            <div className="absolute top-full left-0 mt-1 w-full bg-[#131519] border border-(--border)/60 rounded-lg shadow-2xl z-30 overflow-hidden animate-fadeIn">
              <div className="p-2 border-b border-(--border)/30">
                <div className="relative flex items-center">
                  <FiSearch className="absolute left-2.5 text-(--text)/40 text-xs" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={leadQuery}
                    onChange={(e) => setLeadQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded bg-[#0D0E11] text-white border border-(--border)/30 focus:outline-none focus:border-sky-400"
                    autoFocus
                  />
                </div>
              </div>

              <div className="max-h-44 overflow-y-auto p-1.5 flex flex-col gap-1">
                {leadsLoading && (
                  <div className="p-2 text-center text-xs text-(--text)/50">
                    Searching leads...
                  </div>
                )}
                {!leadsLoading &&
                  leadsList.map((lead) => (
                    <button
                      key={lead._id}
                      type="button"
                      onClick={() => handleLeadSelect(lead)}
                      className="w-full p-2 rounded-md flex items-center gap-2.5 text-xs cursor-pointer hover:bg-white/5 text-(--text)/90 text-left transition-colors"
                    >
                      <div className="w-6 h-6 rounded bg-sky-500/20 text-sky-300 font-bold flex items-center justify-center text-[10px]">
                        {(lead.firstName || lead.name || "U")[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-white">
                          {`${lead.firstName || ""} ${
                            lead.lastName || ""
                          }`.trim() || lead.name}
                        </span>
                        <span className="text-[10px] text-(--text)/50">
                          {lead.email}
                        </span>
                      </div>
                    </button>
                  ))}
                {!leadsLoading && leadsList.length === 0 && (
                  <div className="p-3 text-center text-xs text-(--text)/50">
                    No leads found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Maintainers from Selected Team (if team mode and team has members) */}
        {ownershipMode === "team" && selectedTeam?.members?.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <span className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider">
              <FiShield className="text-base" />
              Maintainers ({watchedMaintainers.length})
            </span>

            <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 bg-[#0D0E11] rounded-lg border border-(--border)/40">
              {selectedTeam.members.map((member) => {
                const memberId =
                  typeof member === "object" ? member._id : member;
                const memberName =
                  typeof member === "object"
                    ? `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
                      member.name ||
                      member.email
                    : "Member";
                const isSelected = watchedMaintainers.includes(memberId);

                return (
                  <button
                    key={memberId}
                    type="button"
                    onClick={() => toggleMaintainer(memberId)}
                    className={`p-2 rounded-md border text-xs flex items-center justify-between transition-colors cursor-pointer text-left ${
                      isSelected
                        ? "border-sky-400 bg-sky-500/15 text-white"
                        : "border-transparent text-(--text)/70 hover:bg-white/5"
                    }`}
                  >
                    <span className="truncate text-xs">{memberName}</span>
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] ${
                        isSelected
                          ? "bg-sky-400 text-black font-bold"
                          : "border border-(--border)/60 text-transparent"
                      }`}
                    >
                      <FiCheck />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Deployment Environment */}
        <div className="flex flex-col gap-2.5">
          <span className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider">
            <MdOutlineRocketLaunch className="text-base" />
            Deployment Environment <span className="text-red-400">*</span>
          </span>

          <input
            type="hidden"
            {...register("environment", {
              required: "Deployment environment is required",
            })}
          />

          <div className="grid grid-cols-3 gap-3">
            {ENVIRONMENT_OPTIONS.map((env) => {
              const IconComponent = env.icon;
              const isSelected = watchedEnvironment === env.value;

              return (
                <button
                  key={env.id}
                  type="button"
                  onClick={() =>
                    setValue("environment", env.value, { shouldValidate: true })
                  }
                  className={`p-3 rounded-lg border text-left flex flex-col gap-2 transition-all duration-200 transform active:scale-95 cursor-pointer ${
                    isSelected
                      ? "border-sky-400 bg-sky-500/15 text-white shadow-[0_0_12px_rgba(56,189,248,0.3)] scale-[1.02]"
                      : "border-(--border)/40 bg-[#0D0E11] text-(--text)/80 hover:border-(--border) hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div
                      className={`p-1.5 rounded-md text-base transition-colors ${
                        isSelected
                          ? "bg-sky-500/20 text-sky-300"
                          : "bg-white/5 text-(--text)"
                      }`}
                    >
                      <IconComponent />
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-sky-400 text-black flex items-center justify-center text-[10px] font-bold">
                        <FiCheck />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-xs text-white">
                      {env.label}
                    </h3>
                    <p className="text-[10px] text-(--text)/50 mt-0.5 line-clamp-2">
                      {env.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
          {errors.environment && (
            <p className="text-red-400 text-xs">
              {errors.environment.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
