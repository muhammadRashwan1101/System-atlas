import { FiPlus } from "react-icons/fi";

export default function NewComponentCard({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center p-8 bg-[#0d0f14]/50 border-2 border-dashed border-[#2b3240] hover:border-sky-400/60 rounded-xl transition-all duration-200 cursor-pointer min-h-[300px] gap-3 text-center group"
    >
      <div className="w-12 h-12 rounded-full bg-[#1a1e26] border border-[#2b3240] group-hover:border-sky-400/50 group-hover:bg-sky-500/10 flex items-center justify-center text-[#8b949e] group-hover:text-sky-300 transition-all">
        <FiPlus className="text-2xl" />
      </div>
      <div>
        <h3 className="font-semibold text-white text-base group-hover:text-sky-300 transition-colors">
          New Component
        </h3>
        <p className="text-xs text-[#8b949e] mt-0.5">Deploy architecture node</p>
      </div>
    </div>
  );
}
