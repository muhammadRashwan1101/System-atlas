import { FiChevronDown } from "react-icons/fi";

export default function FilterDropdown({
  label,
  options = [],
  value,
  onChange,
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-[#10131A] border border-slate-800 rounded-lg px-4 py-2 pr-10 text-sm text-slate-300  focus:outline-none focus:border-slate-600 hover:border-slate-700 transition">
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#2D303A]"
          >
            {label}: {option.label}
          </option>
        ))}
      </select>

      <FiChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2
                   text-slate-500 pointer-events-none"
      />
    </div>
  );
}