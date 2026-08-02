const reactSelectClasses = {
  control: ({ isFocused }) =>
  `min-h-[48px] rounded-lg border px-3 py-2 transition-all ${
    isFocused
      ? "border-(--primary)"
      : "border-(--border)"
  } bg-(--secondary-bg)`,

    valueContainer: () => "flex flex-wrap gap-2",

    input: () => "text-white",

    placeholder: () => "text-gray-100",

    menu: () =>
        "mt-2 rounded-lg border border-gray-100 bg-[#10131A] shadow-xl overflow-hidden",

    menuList: () => "py-2",

  option: ({ isFocused, isSelected }) =>
  `px-4 py-3 cursor-pointer select-none ${
    isSelected
      ? "bg-[#1A2435] text-white"
      : isFocused
      ? "bg-[#111827] text-white"
      : "bg-[#10131A] text-gray-200"
  }`,

    multiValue: () =>
        "flex items-center rounded-full bg-gray-800 px-2 py-1",

    multiValueLabel: () =>
        "text-white text-sm",

    multiValueRemove: () =>
        "ml-1 cursor-pointer rounded-full px-1 text-white hover:bg-gray-500",

    dropdownIndicator: () =>
        "px-2 text-gray-50 hover:text-white",

    clearIndicator: () =>
        "px-2 text-gray-50",

    indicatorSeparator: () =>
        "hidden",
};

export default reactSelectClasses;