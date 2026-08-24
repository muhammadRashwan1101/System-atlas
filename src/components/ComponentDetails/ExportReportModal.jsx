import { useState } from "react";
import { FiX, FiCheck, FiCopy, FiDownload, FiCode } from "react-icons/fi";
import { toast } from "react-toastify";

export default function ExportReportModal({
  isOpen,
  onClose,
  componentData = {},
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(componentData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    toast.success("JSON copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${componentData.name || "component"}-profile.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Profile downloaded successfully!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="flex flex-col bg-[#121418] border border-[#2B3240] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#232730] bg-[#161920]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#ADC6FF]/10 text-[#ADC6FF]">
              <FiCode className="text-xl" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Export Component Profile (ADR / JSON)
              </h3>
              <p className="text-xs font-mono text-[#8b949e]">
                {componentData.name || "Recommendation Service"}
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

        {/* Modal Body */}
        <div className="flex flex-col gap-3 p-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase text-[#8b949e]">
              JSON Metadata Definition
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-[#1f242e] hover:bg-[#2e3340] text-white border border-[#2B3240] transition-colors cursor-pointer font-mono"
            >
              {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#0A0B0D] border border-[#232730] text-xs font-mono text-emerald-300 overflow-y-auto max-h-72 leading-relaxed">
            {jsonString}
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#232730] bg-[#161920]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-[#232730] hover:bg-[#2e3340] text-white transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] transition-colors cursor-pointer"
          >
            <FiDownload />
            <span>Download JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
}
