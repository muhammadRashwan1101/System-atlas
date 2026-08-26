import {
  FiCompass,
  FiLayers,
  FiShare2,
  FiArrowRight,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { PiStarFourFill } from "react-icons/pi";
import { MdDomainAdd } from "react-icons/md";
import useAuth from "../../context/AuthContext";

export default function AdminWelcomeGuideModal({ isOpen, onClose, onStartSetup }) {
  const { user } = useAuth();
  const userName =
    user?.firstName ||
    user?.name?.split(" ")[0] ||
    user?.user?.firstName ||
    user?.user?.name?.split(" ")[0] ||
    "Architect";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-250">
      <div className="relative w-full max-w-2xl bg-[#10141E] border border-[#262D3D] rounded-2xl shadow-2xl overflow-hidden p-8 text-white flex flex-col gap-6">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar */}
        <div className="flex items-center justify-between relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-medium">
            <PiStarFourFill className="w-3.5 h-3.5 text-sky-400" />
            <span>Administrator Setup Guide</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Skip guide"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Header Greeting */}
        <div className="flex flex-col gap-2 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Welcome to System Atlas,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
              {userName}
            </span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome to your architecture control plane. Before mapping components, dependencies, and blast radiuses, let's set up your foundational work environment by creating your first organizational workspace.
          </p>
        </div>

        {/* 3-Step Architecture Setup Roadmap */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
          {/* Step 1 */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-gradient-to-b from-sky-500/15 to-sky-950/20 border border-sky-500/30 text-white relative">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
                <MdDomainAdd className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500 text-slate-950 font-bold">
                Step 1 (Now)
              </span>
            </div>
            <p className="font-semibold text-sm text-sky-200">1. Initialize Workspace</p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Define the root domain & boundary for your team's engineering ecosystem.
            </p>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#161B26] border border-[#232B3B] text-slate-300">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                <FiLayers className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono uppercase text-slate-500">
                Step 2
              </span>
            </div>
            <h4 className="font-semibold text-sm text-slate-200">2. Add Projects</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Group microservices, APIs, and components into dedicated projects.
            </p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#161B26] border border-[#232B3B] text-slate-300">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                <FiShare2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono uppercase text-slate-500">
                Step 3
              </span>
            </div>
            <h4 className="font-semibold text-sm text-slate-200">3. Map Architecture</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize real-time dependency graphs & simulate blast radiuses.
            </p>
          </div>
        </div>

        {/* Action Button & Tip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#232B3B] relative z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <FiCheckCircle className="text-emerald-400 w-4 h-4 shrink-0" />
            <span>You can invite teammates and assign roles once created.</span>
          </div>

          <button
            type="button"
            onClick={onStartSetup}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-sky-500/20 cursor-pointer"
          >
            <span>Start Setting Up Workspace</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
