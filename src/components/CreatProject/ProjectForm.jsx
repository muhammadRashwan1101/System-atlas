import { useState, useEffect, useRef } from "react";
import {
  MdOutlineRocketLaunch,
  MdOutlineLayers,
  MdTerminal,
  MdOutlineGrid4X4,
  MdOutlineFolderOpen,
  MdOutlineSupervisorAccount,
} from "react-icons/md";
import { AiFillCodeSandboxSquare } from "react-icons/ai";
import { MdOutlineHub } from "react-icons/md";
import { GoZap } from "react-icons/go";
import { FiSearch, FiX, FiCheck } from "react-icons/fi";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import useWorkspace from "../../context/WorkspaceContext";
import useAuth from "../../context/AuthContext";
import Breadcrumbs from "../Navigation/Breadcrumbs";
import "react-datepicker/dist/react-datepicker.css";

const TARGET_ENVIRONMENT_OPTIONS = [
  {
    title: "Production Ready",
    value: "production ready",
    icon: MdOutlineRocketLaunch,
  },
  {
    title: "Prototype",
    value: "prototype",
    icon: MdOutlineLayers,
  },
  {
    title: "Development",
    value: "development",
    icon: MdTerminal,
  },
];

const TOPOLOGY_OPTIONS = [
  {
    title: "Monolithic",
    value: "monolithic",
    icon: AiFillCodeSandboxSquare,
  },
  {
    title: "Microservices",
    value: "microservices",
    icon: MdOutlineHub,
  },
  {
    title: "Event Driven",
    value: "event driven",
    icon: GoZap,
  },
  {
    title: "Hybrid",
    value: "hybrid",
    icon: MdOutlineGrid4X4,
  },
];

export default function ProjectForm({ formRef, projectSummary, setProjectSummary }) {
  const { workspaceId } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [targetEnvironment, setTargetEnvironment] = useState("");
  const [systemTopology, setSystemTopology] = useState("");
  const navigate = useNavigate();

  // Project Manager search & dropdown state
  const [managerQuery, setManagerQuery] = useState("");
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [isManagerLoading, setIsManagerLoading] = useState(false);
  const [isManagerDropdownOpen, setIsManagerDropdownOpen] = useState(false);
  const managerContainerRef = useRef(null);

  const departments = [
    "Platform",
    "Frontend",
    "Backend",
    "DevOps",
    "Cloud",
    "Mobile",
    "Security",
    "Data Science",
    "AI/ML",
    "UI/UX",
    "Engineering",
    "QA",
  ];

  const { refreshProjects } = useWorkspace();
  const { completeOnboarding } = useAuth();

  const projectName = watch("name");
  const managerName = watch("managerName");

  const getFullName = (user) => {
    if (!user) return "";
    if (typeof user === "string") return user;
    if (user.fullName) return user.fullName;
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user.name || user.username || "Project Manager";
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        managerContainerRef.current &&
        !managerContainerRef.current.contains(event.target)
      ) {
        setIsManagerDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for only project managers
  useEffect(() => {
    const controller = new AbortController();

    const fetchManagers = async () => {
      setIsManagerLoading(true);
      try {
        const response = await api.get(
          `/team-leads/search?name=${encodeURIComponent(managerQuery || "")}`,
          { signal: controller.signal }
        );

        const rawList = response.data?.data || response.data || [];
        const userList = Array.isArray(rawList) ? rawList : [];

        // Filter only project managers (role === 'manager' or jobTitle includes manager/lead)
        const filteredManagers = userList.filter((u) => {
          const role = String(u.role || u.user?.role || "").toLowerCase();
          const jobTitle = String(
            u.jobTitle || u.user?.jobTitle || ""
          ).toLowerCase();
          const isManagerRole = role === "manager" || role.includes("manager");
          const isManagerTitle =
            jobTitle.includes("manager") || jobTitle.includes("lead");

          return isManagerRole || isManagerTitle || !u.role;
        });

        setManagers(filteredManagers);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Failed to search project managers:", err);
        }
      } finally {
        setIsManagerLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchManagers();
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [managerQuery]);

  useEffect(() => {
    setProjectSummary((prev) => ({
      ...prev,
      name: projectName || "",
      managerName: managerName || "",
    }));
  }, [projectName, managerName, setProjectSummary]);

  const handleSelectManager = (mgr) => {
    const name = getFullName(mgr);
    setSelectedManager(mgr);
    setManagerQuery(name);
    setValue("managerName", name, { shouldValidate: true });
    setIsManagerDropdownOpen(false);

    setProjectSummary((prev) => ({
      ...prev,
      managerName: name,
      department: prev.department || mgr.department || "",
    }));
  };

  const handleClearManager = () => {
    setSelectedManager(null);
    setManagerQuery("");
    setValue("managerName", "", { shouldValidate: true });
    setProjectSummary((prev) => ({
      ...prev,
      managerName: "",
    }));
  };

  const handleManagerInputChange = (e) => {
    const val = e.target.value;
    setManagerQuery(val);
    setSelectedManager(null);
    setValue("managerName", val, { shouldValidate: true });
    setIsManagerDropdownOpen(true);
  };

  const handleProjectSubmit = async (data) => {
    try {
      const projectData = {
        name: data.name,
        description: data.description,
        managerName: data.managerName,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        department: projectSummary.department,
        targetEnvironment,
        systemTopology,
      };

      const response = await api.post(
        `/workspaces/${workspaceId}/projects`,
        projectData
      );

      toast.success(response.data.msg || "Project initialized successfully");

      if (completeOnboarding) {
        await completeOnboarding();
      }

      if (workspaceId) {
        refreshProjects(workspaceId);
      }

      const createdProjectId =
        response.data?.project?._id || response.data?.data?._id;
      if (createdProjectId && workspaceId) {
        navigate(
          `/workspaces/${workspaceId}/projects/${createdProjectId}/graph`
        );
      } else if (workspaceId) {
        navigate(`/workspaces/${workspaceId}`);
      }
    } catch (err) {
      const message = Array.isArray(err.response?.data?.msg)
        ? err.response.data.msg.join(", ")
        : err.response?.data?.msg;

      setError(message || "Unable to connect to the server");
      toast.error(message || "Unable to connect to the server");
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="flex flex-col w-full h-full p-5 ps-30">
      <div className="w-2/3 h-full pb-10">
        <div className="flex flex-col mb-8 gap-3">
          <Breadcrumbs />
          <div className="flex items-center gap-3">
            <MdOutlineFolderOpen className="w-7 h-7 text-(--primary)" />
            <h2 className="text-3xl font-bold text-white text-shadow-[0_0px_18px_rgba(138,175,207,0.5)]">
              Create Project
            </h2>
          </div>
          <p className="text-(--text) text-sm font-light">
            Create an organizational boundary for architecture governance and
            ownership.
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit(handleProjectSubmit)}
          className="flex flex-col gap-8 w-full"
        >
          {/* 0.1 Project Details */}
          <div className="flex flex-col gap-4">
            <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
              0.1 Project Details
            </h2>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="projectName"
                className="text-(--text) font-(family-name:--labels) uppercase text-[10px]"
              >
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                placeholder="e.g. E-Commerce Platform"
                {...register("name", { required: "Project name is required" })}
                className="p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg) transition-all ease-in-out duration-200 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]"
              />
              {errors.name && (
                <p className="text-red-400 text-xs font-mono">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label
                htmlFor="projectDescription"
                className="text-(--text) font-(family-name:--labels) uppercase text-[10px]"
              >
                Description
              </label>
              <textarea
                id="projectDescription"
                placeholder="Brief technical summary..."
                rows={3}
                {...register("description", {
                  required: "Description is required",
                })}
                className="p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg) transition-all ease-in-out duration-200 resize-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]"
              />
              {errors.description && (
                <p className="text-red-400 text-xs font-mono">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Timeline Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-(--text) font-(family-name:--labels) uppercase text-[10px]">
                  Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  className="w-full p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none font-mono text-xs"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-(--text) font-(family-name:--labels) uppercase text-[10px]">
                  End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  className="w-full p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* 0.2 Target Environment & Topology */}
          <div className="flex flex-col gap-5">
            <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
              0.2 Target Environment & Topology
            </h2>

            <div className="flex flex-col gap-2">
              <span className="text-(--text) font-(family-name:--labels) uppercase text-[10px]">
                Target Environment
              </span>
              <div className="grid grid-cols-3 gap-3">
                {TARGET_ENVIRONMENT_OPTIONS.map((item) => {
                  const isSelected = targetEnvironment === item.value;
                  return (
                    <div
                      key={item.value}
                      onClick={() => {
                        setTargetEnvironment(item.value);
                        setProjectSummary((prev) => ({
                          ...prev,
                          targetEnvironment: item.title,
                        }));
                      }}
                      className={`p-4 flex flex-col items-center justify-center border rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-(--primary) bg-[#ADC6FF]/10 text-white shadow-[0_0_12px_rgba(173,198,255,0.25)]"
                          : "border-(--border)/60 bg-(--secondary-bg) text-slate-400 hover:text-white hover:border-slate-600"
                      }`}
                    >
                      <item.icon
                        className={`text-2xl mb-2 ${
                          isSelected ? "text-(--primary)" : "text-slate-400"
                        }`}
                      />
                      <span className="text-xs font-mono font-medium uppercase tracking-wide text-center">
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <span className="text-(--text) font-(family-name:--labels) uppercase text-[10px]">
                System Topology
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TOPOLOGY_OPTIONS.map((item) => {
                  const isSelected = systemTopology === item.value;
                  return (
                    <div
                      key={item.value}
                      onClick={() => {
                        setSystemTopology(item.value);
                        setProjectSummary((prev) => ({
                          ...prev,
                          systemTopology: item.title,
                        }));
                      }}
                      className={`p-3.5 flex flex-col items-center justify-center border rounded-xl cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-(--primary) bg-[#ADC6FF]/10 text-white shadow-[0_0_12px_rgba(173,198,255,0.25)]"
                          : "border-(--border)/60 bg-(--secondary-bg) text-slate-400 hover:text-white hover:border-slate-600"
                      }`}
                    >
                      <item.icon
                        className={`text-2xl mb-2 ${
                          isSelected ? "text-(--primary)" : "text-slate-400"
                        }`}
                      />
                      <span className="text-xs font-mono font-medium uppercase tracking-wide text-center">
                        {item.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 0.3 Ownership & Governance */}
          <div className="flex flex-col gap-4">
            <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
              0.3 Governance & Department
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Searchable Project Manager (matching TeamLeadSelect design) */}
              <div className="flex flex-col gap-2" ref={managerContainerRef}>
                <label
                  htmlFor="ManagerName"
                  className="text-(--text) font-(family-name:--labels) uppercase text-[10px] flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <MdOutlineSupervisorAccount className="text-sm text-(--primary)" />
                    Project Manager
                  </span>
                  <span className="text-slate-500 font-mono text-[9px]">
                    Directory
                  </span>
                </label>

                {/* Hidden input for react-hook-form registration */}
                <input
                  type="hidden"
                  {...register("managerName", {
                    required: "Manager name is required",
                  })}
                />

                <div className="p-3 rounded-xl border border-(--border)/60 bg-(--secondary-bg) w-full">
                  {selectedManager || (managerName && !isManagerDropdownOpen && managerQuery) ? (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-(--border)/60 bg-[#141721] w-full">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#1B202D] border border-(--primary)/30 text-(--primary) flex items-center justify-center font-mono font-bold text-xs shrink-0">
                          {getFullName(selectedManager || managerName)[0] || "PM"}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-slate-100 font-semibold text-sm truncate">
                            {getFullName(selectedManager || managerName)}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px] tracking-wide truncate">
                            {selectedManager?.email || selectedManager?.department || "Project Manager"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleClearManager}
                        className="px-3 py-1 rounded text-[11px] font-mono tracking-wider text-red-400 hover:text-red-300 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors cursor-pointer uppercase shrink-0 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-full">
                      <div className="flex items-center gap-3 px-3 py-2 bg-[#0d0f14] border border-(--border)/60 rounded-lg focus-within:border-(--primary) transition-colors">
                        <FiSearch className="text-slate-500 text-base shrink-0" />
                        <input
                          type="text"
                          id="ManagerName"
                          placeholder="Search project manager by name..."
                          value={managerQuery}
                          onFocus={() => setIsManagerDropdownOpen(true)}
                          onChange={handleManagerInputChange}
                          className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none font-sans"
                        />
                        {isManagerLoading && (
                          <div className="w-3.5 h-3.5 border-2 border-(--primary) border-t-transparent rounded-full animate-spin shrink-0"></div>
                        )}
                      </div>

                      {isManagerDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full mt-2 bg-[#0d0f14] border border-slate-800 rounded-lg shadow-xl max-h-52 overflow-y-auto z-30 divide-y divide-slate-800/40">
                          {isManagerLoading ? (
                            <div className="p-3 text-xs text-slate-500 font-mono text-center">
                              Loading directory...
                            </div>
                          ) : managers.length > 0 ? (
                            managers.map((mgr) => {
                              const fullName = getFullName(mgr);
                              return (
                                <button
                                  key={mgr._id || mgr.id || fullName}
                                  type="button"
                                  onClick={() => handleSelectManager(mgr)}
                                  className="w-full text-left p-3 flex items-center justify-between hover:bg-slate-800/50 transition-colors cursor-pointer"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-md bg-slate-800 border border-slate-700/50 flex items-center justify-center font-bold text-(--primary) text-xs shrink-0">
                                      {fullName[0] || "PM"}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <span className="text-sm font-medium text-slate-200 truncate">
                                        {fullName}
                                      </span>
                                      <span className="text-xs text-slate-500 truncate font-mono">
                                        {mgr.email || mgr.department || "Project Manager"}
                                      </span>
                                    </div>
                                  </div>
                                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-(--primary)/10 text-(--primary) border border-(--primary)/20 shrink-0 ml-2">
                                    Manager
                                  </span>
                                </button>
                              );
                            })
                          ) : (
                            <div className="p-3 text-xs text-slate-500 font-mono text-center">
                              No project managers found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {errors.managerName && (
                  <p className="text-red-400 text-xs font-mono">
                    {errors.managerName.message}
                  </p>
                )}
              </div>

              {/* Department */}
              <div className="flex flex-col gap-2">
                <label className="text-(--text) font-(family-name:--labels) uppercase text-[10px]">
                  Department
                </label>
                <select
                  value={projectSummary.department}
                  onChange={(e) => {
                    setProjectSummary((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }));
                  }}
                  className="p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg) transition-all ease-in-out duration-200 font-mono text-xs"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option
                      key={index}
                      value={dept}
                      className="bg-[#121315] text-white"
                    >
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}