import { IoMdFolderOpen } from "react-icons/io";
import { MdOutlineDomain } from "react-icons/md";
import { PiTreeStructure, PiStarFourFill } from "react-icons/pi";
import { FaRegCircleCheck } from "react-icons/fa6";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FiArrowRight } from "react-icons/fi";
import logo from "../../assets/system_atlas_logo.png";
import useAuth from "../../context/AuthContext";

export default function AdminWelcomeScreen({ onProceedToForm }) {
  const { user } = useAuth();
  const userName =
    user?.firstName ||
    user?.name?.split(" ")[0] ||
    user?.user?.firstName ||
    user?.user?.name?.split(" ")[0] ||
    "Administrator";

  return (
    <div className="flex flex-col flex-1 w-full min-h-screen bg-(--main-bg) p-8 sm:p-12 justify-between">
      {/* Top Header Section */}
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pt-4">
        {/* Brand bar */}
        <div className="flex items-center justify-between pb-6 border-b border-(--border)/30">
          <div className="flex items-center gap-3">
            <img src={logo} alt="System Atlas" className="w-10 h-auto rounded-md" />
            <span className="font-(family-name:--labels) uppercase text-sm tracking-wider text-(--primary)">
              System Atlas // Onboarding
            </span>
          </div>

          <div className="flex items-center gap-2 font-(family-name:--labels) text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-(--secondary-bg) border border-(--border)/40 text-(--tertiary) uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-(--tertiary) shadow-[0_0_8px_#10B981]" />
              Super Admin Setup
            </span>
          </div>
        </div>

        {/* Hero Greeting */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center gap-2">
            <PiStarFourFill className="w-4 h-4 text-(--primary)" />
            <h3 className="font-(family-name:--labels) text-xs uppercase tracking-widest text-(--primary)">
              Initial Environment Initialization
            </h3>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white text-shadow-[0_0px_18px_rgba(138,175,207,0.5)]">
            Welcome to System Atlas, {userName}
          </h1>
          <p className="text-(--text) text-sm sm:text-base max-w-3xl leading-relaxed">
            Welcome to your architecture control plane. Before cataloging microservices and mapping dependency graphs, let's establish your foundational work environment by creating your first organizational workspace.
          </p>
        </div>

        {/* 3 Step Architectural Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          {/* Step 1: Active Workspace */}
          <div className="flex flex-col justify-between p-5 bg-(--secondary-bg) border-2 border-(--primary) rounded-xl shadow-[inset_2px_2px_7px_0px_rgba(145,150,161,0.15),inset_-2px_-2px_7px_rgba(0,0,0,0.6)] relative">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-(--main-bg) rounded-lg border border-(--border)/50 shadow-[2px_2px_4px_rgba(0,0,0,0.6),-2px_-2px_4px_rgba(255,225,255,0.05)]">
                  <MdOutlineDomain className="w-5 h-5 text-(--primary)" />
                </div>
                <span className="font-(family-name:--labels) text-[10px] uppercase px-2.5 py-0.5 rounded bg-(--primary) text-(--text-primary) font-bold">
                  Step 1 (Now)
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-(family-name:--labels) text-sm font-semibold text-white">
                  01. Create Workspace
                </h3>
                <p className="text-xs text-(--text) leading-relaxed">
                  Establish the root organizational boundary and governance domain.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-(--border)/20 flex items-center gap-1.5 text-xs font-(family-name:--labels) text-(--primary)">
              <FaRegCircleCheck className="w-3.5 h-3.5" />
              <span>Current Task</span>
            </div>
          </div>

          {/* Step 2: Define Teams */}
          <div className="flex flex-col justify-between p-5 bg-(--secondary-bg) border border-(--border)/30 rounded-xl shadow-[inset_2px_2px_7px_0px_rgba(145,150,161,0.05),inset_-2px_-2px_7px_rgba(0,0,0,0.6)] opacity-85 hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-(--main-bg) rounded-lg border border-(--border)/50">
                  <HiOutlineUserGroup className="w-5 h-5 text-(--text)" />
                </div>
                <span className="font-(family-name:--labels) text-[10px] uppercase px-2 py-0.5 rounded bg-(--main-bg) border border-(--border)/40 text-(--text) font-mono">
                  Step 2
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-(family-name:--labels) text-sm font-semibold text-white">
                  02. Define Teams
                </h3>
                <p className="text-xs text-(--text) leading-relaxed">
                  Provision engineering units, categories, and technical leads.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-(--border)/20 text-xs font-(family-name:--labels) text-(--border)">
              Unlocks after Step 1
            </div>
          </div>

          {/* Step 3: Project & Graph */}
          <div className="flex flex-col justify-between p-5 bg-(--secondary-bg) border border-(--border)/30 rounded-xl shadow-[inset_2px_2px_7px_0px_rgba(145,150,161,0.05),inset_-2px_-2px_7px_rgba(0,0,0,0.6)] opacity-85 hover:opacity-100 transition-opacity">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 bg-(--main-bg) rounded-lg border border-(--border)/50">
                  <IoMdFolderOpen className="w-5 h-5 text-(--text)" />
                </div>
                <span className="font-(family-name:--labels) text-[10px] uppercase px-2 py-0.5 rounded bg-(--main-bg) border border-(--border)/40 text-(--text) font-mono">
                  Step 3
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-(family-name:--labels) text-sm font-semibold text-white">
                  03. Create Project & Graph
                </h3>
                <p className="text-xs text-(--text) leading-relaxed">
                  Initialize project scope and enter the live Graph Explorer & Sidebar.
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-(--border)/20 text-xs font-(family-name:--labels) text-(--border)">
              Unlocks Full Navigation & Sidebar
            </div>
          </div>
        </div>

        {/* Governance summary note */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-(--secondary-bg) border border-(--border)/40 mt-2 font-(family-name:--labels) text-xs text-(--text)">
          <HiOutlineUserGroup className="w-5 h-5 text-(--primary) shrink-0" />
          <span>
            Once created, you will be designated as the Workspace Super Admin with full authority to invite team members, provision roles, and govern microservices.
          </span>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full pt-6 pb-2 border-t border-(--border)/40 font-(family-name:--labels)">
        <p className="text-xs text-(--border) uppercase">
          System Atlas // Initial Setup
        </p>

        <button
          type="button"
          onClick={onProceedToForm}
          className="flex items-center gap-3 px-8 py-3 text-sm font-medium text-(--text-primary) bg-(--primary) rounded-lg shadow-none hover:bg-(--primary)/90 hover:shadow-[0px_0px_10px_rgba(173,198,255,0.6)] transform ease-in-out duration-300 uppercase cursor-pointer"
        >
          <span>Start Setting Up Workspace</span>
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
