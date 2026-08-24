import { useState, useRef, useEffect } from "react";
import {
  FiPlus,
  FiMinus,
  FiMaximize,
  FiRotateCcw,
  FiSidebar,
  FiGrid,
  FiCheck,
} from "react-icons/fi";

const LAYOUT_OPTIONS = [
  {
    id: "breadthfirst",
    label: "Hierarchical DAG",
    desc: "Left-to-right architectural pipeline",
  },
  {
    id: "cose",
    label: "Force-Directed (COSE)",
    desc: "Physics-based organic clustering",
  },
  {
    id: "concentric",
    label: "Concentric Rings",
    desc: "Radial hierarchy based on connectivity",
  },
  {
    id: "circle",
    label: "Circular Ring",
    desc: "Clean circular perimeter arrangement",
  },
  {
    id: "grid",
    label: "Grid Matrix",
    desc: "Structured uniform grid alignment",
  },
];

export default function GraphToolbar({
  onZoomIn,
  onZoomOut,
  onFit,
  onResetLayout,
  isInspectorOpen = true,
  onToggleInspector,
  activeLayout = "breadthfirst",
  onChangeLayout,
}) {
  const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
  const layoutMenuRef = useRef(null);

  // Close side menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        layoutMenuRef.current &&
        !layoutMenuRef.current.contains(e.target)
      ) {
        setIsLayoutMenuOpen(false);
      }
    };

    if (isLayoutMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isLayoutMenuOpen]);

  const handleSelectLayout = (id) => {
    if (onChangeLayout) {
      onChangeLayout(id);
    }
    setIsLayoutMenuOpen(false);
  };

  return (
    <div className="absolute bottom-6 left-6 z-30 flex flex-col items-center gap-3 pointer-events-auto select-none">
      {/* Floating Vertical Pill Controls */}
      <div className="relative flex flex-col items-center bg-[#101217]/90 backdrop-blur-md border border-[#222634] rounded-xl p-1 shadow-2xl divide-y divide-[#222634]">
        {/* Zoom In */}
        <button
          type="button"
          onClick={onZoomIn}
          title="Zoom In"
          className="p-2 text-[#9CA3AF] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <FiPlus className="text-sm" />
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-2 text-[#9CA3AF] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <FiMinus className="text-sm" />
        </button>

        {/* Fit to Viewport */}
        <button
          type="button"
          onClick={onFit}
          title="Fit Screen"
          className="p-2 text-[#9CA3AF] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <FiMaximize className="text-xs" />
        </button>

        {/* Re-center / Reset Layout */}
        <button
          type="button"
          onClick={onResetLayout}
          title="Re-run Current Layout"
          className="p-2 text-[#9CA3AF] hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <FiRotateCcw className="text-xs" />
        </button>

        {/* Layout Switcher Trigger */}
        <div className="relative" ref={layoutMenuRef}>
          <button
            type="button"
            onClick={() => setIsLayoutMenuOpen((prev) => !prev)}
            title="Change Graph Layout"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isLayoutMenuOpen
                ? "bg-(--primary)/20 text-(--primary)"
                : "text-[#9CA3AF] hover:text-white hover:bg-white/10"
            }`}
          >
            <FiGrid className="text-xs" />
          </button>

          {/* Side Dropdown Menu (Opens to the right) */}
          {isLayoutMenuOpen && (
            <div className="absolute left-full bottom-0 ml-3 w-64 bg-[#131519]/95 backdrop-blur-md border border-[#2B3240] rounded-2xl shadow-[8px_8px_24px_rgba(0,0,0,0.8),-4px_-4px_16px_rgba(30,33,41,0.5)] p-2 z-50 flex flex-col gap-1 animate-in fade-in slide-in-from-left-2 duration-150">
              <div className="px-3 py-1.5 border-b border-[#2B3240]/60">
                <span className="text-[10px] font-(family-name:--labels) text-(--text)/50 uppercase tracking-wider block">
                  Graph Layouts
                </span>
              </div>

              {LAYOUT_OPTIONS.map((layout) => {
                const isActive = activeLayout === layout.id;
                return (
                  <button
                    key={layout.id}
                    type="button"
                    onClick={() => handleSelectLayout(layout.id)}
                    className={`flex items-start justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      isActive
                        ? "bg-sky-500/15 border border-sky-400/30 text-white shadow-sm"
                        : "hover:bg-white/5 border border-transparent text-[#9CA3AF] hover:text-white"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold font-(family-name:--headers) text-white">
                        {layout.label}
                      </span>
                      <span className="text-[10px] font-(family-name:--labels) text-(--text)/50 mt-0.5">
                        {layout.desc}
                      </span>
                    </div>

                    {isActive && (
                      <FiCheck className="text-(--primary) text-xs mt-0.5 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Inspector Panel Toggle Button */}
      {onToggleInspector && (
        <button
          type="button"
          onClick={onToggleInspector}
          title={isInspectorOpen ? "Collapse Inspector" : "Expand Inspector"}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            isInspectorOpen
              ? "bg-[#101217] border-[#222634] text-[#9CA3AF] hover:text-white"
              : "bg-sky-500/10 border-sky-400/30 text-sky-400"
          }`}
        >
          <FiSidebar className="text-sm" />
        </button>
      )}
    </div>
  );
}
