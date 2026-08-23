import { FiChevronDown } from "react-icons/fi";

export default function FilterDropdown({
  label,
  options = [],
  value = "all",
  onChange = () => {},
}) {
  return (
    
    <div className="relative ">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          h-9
          min-w-[150px]
          appearance-none
          bg-[#10131A]
          border border-slate-800
          rounded-lg
          pl-3.5
          pr-9
          text-xs
          text-slate-300
          outline-none
          cursor-pointer
          transition-colors
          hover:border-slate-700
          focus:border-slate-600
        "
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-[#10131A] text-slate-300"
          >
            {option.label}
          </option>
        ))}
      </select>

      <FiChevronDown
        size={14}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-slate-500
          pointer-events-none
        "
      />
    </div>
  );
}