import { useState } from "react";
import { FiX, FiDownload, FiCheck, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";

export default function GenerateReportModal({ isOpen, onClose }) {
  const [reportType, setReportType] = useState("executive-summary");
  const [includeTopology, setIncludeTopology] = useState(true);
  const [includeAuditFindings, setIncludeAuditFindings] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownloadReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Executive Architecture Report (PDF) downloaded successfully!");
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="flex flex-col bg-[#121418] border border-[#2B3240] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#232730] bg-[#161920]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#ADC6FF]/10 text-[#ADC6FF]">
              <FiFileText className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Generate Architecture Report
              </h3>
              <p className="text-xs font-mono text-[#8b949e]">
                Q3-2024 Executive Governance Profile
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
              Report Scope & Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#161920] border border-[#232730] text-white text-xs font-mono focus:outline-none focus:border-[#ADC6FF]"
            >
              <option value="executive-summary">
                Full Executive Summary (PDF)
              </option>
              <option value="governance-audit">
                Governance & Orphan Audit (PDF)
              </option>
              <option value="compliance-export">
                Compliance & Ownership Spec (JSON)
              </option>
            </select>
          </div>

          <div className="flex flex-col gap-2.5 pt-2 border-t border-[#232730]">
            <label className="text-[10px] font-mono uppercase text-[#8b949e]">
              Report Sections
            </label>

            <label className="flex items-center gap-2 text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeTopology}
                onChange={(e) => setIncludeTopology(e.target.checked)}
                className="w-4 h-4 rounded bg-[#161920] border-[#232730] text-[#ADC6FF] focus:ring-0"
              />
              <span>Include System Topology Map & Relationship Matrices</span>
            </label>

            <label className="flex items-center gap-2 text-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeAuditFindings}
                onChange={(e) => setIncludeAuditFindings(e.target.checked)}
                className="w-4 h-4 rounded bg-[#161920] border-[#232730] text-[#ADC6FF] focus:ring-0"
              />
              <span>Include Critical Governance & Missing Documentation Alerts</span>
            </label>
          </div>
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
            onClick={handleDownloadReport}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] transition-colors cursor-pointer"
          >
            <FiDownload />
            <span>{isGenerating ? "Exporting PDF..." : "Export PDF Report"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
