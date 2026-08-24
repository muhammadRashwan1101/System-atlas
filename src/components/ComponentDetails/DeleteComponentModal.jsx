import { FiAlertTriangle, FiX, FiTrash2 } from "react-icons/fi";

export default function DeleteComponentModal({
  isOpen,
  onClose,
  onConfirm,
  componentName = "Recommendation Service",
  isDeleting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="flex flex-col bg-[#121418] border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#232730] bg-[#161920]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
              <FiAlertTriangle className="text-xl" />
            </div>
            <h3 className="text-sm font-semibold text-white">Delete Component</h3>
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
        <div className="p-6 text-xs text-[#C4C6D0] leading-relaxed flex flex-col gap-3">
          <p>
            Are you sure you want to delete{" "}
            <strong className="text-white font-semibold">{componentName}</strong>?
          </p>
          <p className="text-[#8b949e]">
            This will permanently remove the component definition, its technology mappings, documentation references, and all associated graph relationships.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#232730] bg-[#161920]">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-[#232730] hover:bg-[#2e3340] text-white transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-colors cursor-pointer"
          >
            <FiTrash2 />
            <span>{isDeleting ? "Deleting..." : "Delete Component"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
