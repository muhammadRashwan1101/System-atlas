import {
  FiShare2, FiSidebar, FiSliders, FiTerminal,
  FiCloud, FiShield, FiDatabase, FiCompass, FiCheckSquare,
} from "react-icons/fi";
import { useEffect } from "react";
const categories = [
  { id: "Platform", label: "Platform", icon: FiShare2 },
  { id: "Frontend", label: "Frontend", icon: FiSidebar },
  { id: "Backend", label: "Backend", icon: FiSliders },
  { id: "DevOps", label: "DevOps", icon: FiTerminal },
  { id: "Cloud", label: "Cloud", icon: FiCloud },
  { id: "Security", label: "Security", icon: FiShield },
  { id: "Data Science", label: "Data Science", icon: FiDatabase },
  { id: "Other", label: "Architecture", icon: FiCompass },
  { id: "QA", label: "QA", icon: FiCheckSquare },
];

export default function CategorySection({
  selectedCategory,
  onSelectCategory,
  resetTrigger,
}) {
  useEffect(() => {
    if (resetTrigger) {
      onSelectCategory("");
    }
  }, [resetTrigger, onSelectCategory]);

  const handleCategoryClick = (categoryId) => {
    const newCategory = selectedCategory === categoryId ? "" : categoryId;
    onSelectCategory?.(newCategory);
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wider">
        <span>Team Category</span>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`p-3.5 rounded-lg border font-mono text-sm transition-all duration-150 transform active:scale-95 flex items-center gap-3 cursor-pointer ${
                isSelected
                  ? "border-sky-500/80 bg-sky-500/10 text-sky-400 shadow-md shadow-sky-500/10"
                  : "border-slate-800/80 bg-[#0d0f14] text-slate-300 hover:border-slate-700 hover:text-white"
              }`}
            >
              <div
                className={`p-2 rounded-md transition-colors ${
                  isSelected ? "bg-sky-500/20 text-sky-400" : "bg-slate-800/60 text-slate-400"
                }`}
              >
                <IconComponent className="text-base" />
              </div>

              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}