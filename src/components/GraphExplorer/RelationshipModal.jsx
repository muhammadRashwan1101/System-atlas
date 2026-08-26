import { useState, useEffect } from "react";
import { FiX, FiShare2, FiArrowRight, FiCheck } from "react-icons/fi";

const RELATIONSHIP_TYPES = [
  { value: "calls", label: "calls (Synchronous API)" },
  { value: "reads-from", label: "reads-from (Query / Read Store)" },
  { value: "writes-to", label: "writes-to (Mutation / Write Store)" },
  { value: "publishes-to", label: "publishes-to (Event Producer)" },
  { value: "subscribes-to", label: "subscribes-to (Event Consumer)" },
  { value: "consumes-from", label: "consumes-from (Message Queue)" },
  { value: "depends-on", label: "depends-on (Architecture Dependency)" },
];

const PROTOCOLS = [
  { value: "HTTPS", label: "HTTPS (Encrypted REST / Web)" },
  { value: "HTTP", label: "HTTP (Plain Text REST)" },
  { value: "gRPC", label: "gRPC (HTTP/2 Protocol Buffers)" },
  { value: "SQL", label: "SQL (PostgreSQL / MySQL Database)" },
  { value: "WebSocket", label: "WebSocket (Real-Time Bidirectional)" },
  { value: "AMQP", label: "AMQP (RabbitMQ / Message Broker)" },
];

export default function RelationshipModal({
  isOpen,
  onClose,
  onSubmit,
  sourceName = "Source Component",
  targetName = "Target Component",
  initialData = null,
  isSubmitting = false,
  mode = "create", // "create" | "edit"
}) {
  const [type, setType] = useState(initialData?.type || "calls");
  const [protocol, setProtocol] = useState(initialData?.protocol || "HTTPS");
  const [error, setError] = useState(null);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!type) {
      setError("Please select a relationship type.");
      return;
    }
    setError(null);
    onSubmit({ type, protocol });
  };

  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#131519] border border-(--border)/30 rounded-2xl shadow-[8px_8px_24px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(30,33,41,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2B3240]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-(--primary) border border-sky-400/20">
              <FiShare2 className="text-lg" />
            </div>
            <div>
              <h3 className="font-(family-name:--headers) font-semibold text-white text-base">
                {isEdit ? "Edit Relationship" : "Create Relationship"}
              </h3>
              <p className="text-xs font-(family-name:--labels) text-(--text)/50">
                {isEdit
                  ? "Update connection type and protocol"
                  : "Connect components in architecture topology"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-(--text)/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Read-Only Source and Target Cards */}
          <div className="flex items-center gap-2 p-3 bg-[#0B0E15] rounded-xl border border-(--border)/20 shadow-[inset_2px_2px_6px_rgba(5,6,8,0.8)]">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-(family-name:--labels) text-(--text)/40 uppercase block">
                Source Component
              </span>
              <p className="font-semibold text-white text-xs truncate mt-0.5">
                {sourceName}
              </p>
            </div>

            <div className="p-1.5 rounded-full bg-[#191B23] border border-[#2B3240] text-(--primary) shrink-0">
              <FiArrowRight className="text-xs" />
            </div>

            <div className="flex-1 min-w-0 text-right">
              <span className="text-[10px] font-(family-name:--labels) text-(--text)/40 uppercase block">
                Target Component
              </span>
              <p className="font-semibold text-white text-xs truncate mt-0.5">
                {targetName}
              </p>
            </div>
          </div>

          {/* Relationship Type */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="relType"
              className="text-xs font-(family-name:--labels) text-[#C4C6D0]/70 uppercase tracking-wider"
            >
              Relationship Type <span className="text-(--danger)">*</span>
            </label>
            <select
              id="relType"
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-[#101217] border border-[#222634] focus:border-sky-400 text-white rounded-xl p-2.5 text-xs font-(family-name:--labels) focus:outline-none transition-colors cursor-pointer"
            >
              {RELATIONSHIP_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-[#131519] text-white">
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Protocol */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="relProtocol"
              className="text-xs font-(family-name:--labels) text-[#C4C6D0]/70 uppercase tracking-wider"
            >
              Communication Protocol <span className="text-(--danger)">*</span>
            </label>
            <select
              id="relProtocol"
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-[#101217] border border-[#222634] focus:border-sky-400 text-white rounded-xl p-2.5 text-xs font-(family-name:--labels) focus:outline-none transition-colors cursor-pointer"
            >
              {PROTOCOLS.map((p) => (
                <option key={p.value} value={p.value} className="bg-[#131519] text-white">
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-(--danger) text-xs font-(family-name:--labels)">
              {error}
            </div>
          )}

          {/* Footer Action CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2B3240] mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-(--border)/30 text-white hover:bg-white/5 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-(--primary) hover:bg-[#ccdaff] text-(--text-primary) font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-blue-500/10"
            >
              {isSubmitting ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiCheck className="text-sm" />
              )}
              {isEdit ? "Update Relationship" : "Create Relationship"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
