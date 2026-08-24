import { useState } from "react";
import { FiX, FiRefreshCw, FiCheck } from "react-icons/fi";
import { toast } from "react-toastify";

export default function SwapTechnologyModal({
  isOpen,
  onClose,
  targetComponent = { name: "Recommendation Service" },
  onApplySwap = () => {},
}) {
  const [selectedCategory, setSelectedCategory] = useState("database");
  const [newTechnology, setNewTechnology] = useState("PostgreSQL 16");

  if (!isOpen) return null;

  const handleConfirm = () => {
    toast.success(`Technology swap applied: ${newTechnology}`);
    onApplySwap({ category: selectedCategory, technology: newTechnology });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="flex flex-col bg-[#121418] border border-[#2B3240] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#232730] bg-[#161920]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#ADC6FF]/10 text-[#ADC6FF]">
              <FiRefreshCw className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Simulate Technology Swap
              </h3>
              <p className="text-xs font-mono text-[#8b949e]">
                {targetComponent.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-6 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase text-[#8b949e]">
              Layer / Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#161920] border border-[#232730] text-white text-xs font-mono focus:outline-none focus:border-[#ADC6FF]"
            >
              <option value="database">Database Layer</option>
              <option value="cache">Cache Layer</option>
              <option value="messaging">Messaging & Queue</option>
              <option value="backend">Backend Runtime</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase text-[#8b949e]">
              Replacement Technology
            </label>
            <select
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#161920] border border-[#232730] text-white text-xs font-mono focus:outline-none focus:border-[#ADC6FF]"
            >
              <option value="PostgreSQL 16">PostgreSQL 16</option>
              <option value="MongoDB Atlas">MongoDB Atlas (Document DB)</option>
              <option value="Redis Cluster v7">Redis Cluster v7 (In-Memory)</option>
              <option value="Apache Kafka 3.6">Apache Kafka 3.6 (Event Streaming)</option>
              <option value="Go / Gin Web Framework">Go / Gin Web Framework</option>
            </select>
          </div>

          <p className="text-[11px] text-[#8b949e] pt-2 border-t border-[#232730]">
            Simulating this change will dynamically re-evaluate throughput, latency constraints, and downstream protocol compatibility in the blast radius.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#232730] bg-[#161920]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-[#232730] hover:bg-[#2e3340] text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] transition-colors cursor-pointer"
          >
            <FiCheck />
            <span>Apply Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
}
