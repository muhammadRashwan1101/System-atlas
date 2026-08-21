import { useEffect } from "react";
import { FiAlertTriangle, FiX, FiTrash2, FiArrowRight } from "react-icons/fi";

export default function DeleteRelationshipModal({
  isOpen,
  onClose,
  onConfirm,
  sourceName = "Source Component",
  targetName = "Target Component",
  relType = "depends-on",
  protocol = "HTTPS",
  isDeleting = false,
}) {
  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#131519] border border-(--border)/30 rounded-2xl shadow-[8px_8px_24px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(30,33,41,0.5)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2B3240]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-(--danger) border border-red-500/20">
              <FiAlertTriangle className="text-lg" />
            </div>
            <div>
              <h3 className="font-(family-name:--headers) font-semibold text-white text-base">
                Delete Relationship?
              </h3>
              <p className="text-xs font-(family-name:--labels) text-(--text)/50">
                Confirm architectural relationship removal
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-(--text)/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 flex flex-col gap-4">
          <p className="text-xs font-(family-name:--body-font) text-(--text)/80 leading-relaxed">
            This relationship will be permanently removed from your system architecture topology. Components will no longer communicate across this path.
          </p>

          {/* Connection Details Preview Card */}
          <div className="flex items-center gap-2 p-3 bg-[#0B0E15] rounded-xl border border-(--border)/20 shadow-[inset_2px_2px_6px_rgba(5,6,8,0.8)]">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-(family-name:--labels) text-(--text)/40 uppercase block">
                Source
              </span>
              <p className="font-semibold text-white text-xs truncate mt-0.5">
                {sourceName}
              </p>
            </div>

            <div className="flex flex-col items-center gap-1 shrink-0 px-2">
              <span className="px-2 py-0.2 rounded bg-sky-500/10 border border-sky-400/20 text-(--primary) text-[9px] font-(family-name:--labels)">
                {relType}
              </span>
              <FiArrowRight className="text-xs text-(--text)/50" />
            </div>

            <div className="flex-1 min-w-0 text-right">
              <span className="text-[10px] font-(family-name:--labels) text-(--text)/40 uppercase block">
                Target
              </span>
              <p className="font-semibold text-white text-xs truncate mt-0.5">
                {targetName}
              </p>
            </div>
          </div>

          {protocol && (
            <div className="flex items-center justify-between text-xs px-1 text-(--text)/60 font-(family-name:--labels)">
              <span>Protocol:</span>
              <span className="text-white font-medium">{protocol}</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#2B3240] mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl border border-(--border)/30 text-white hover:bg-white/5 text-xs font-medium transition-all cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all cursor-pointer disabled:opacity-50 shadow-md shadow-red-600/20"
            >
              {isDeleting ? (
                <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiTrash2 className="text-sm" />
              )}
              Delete Relationship
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
