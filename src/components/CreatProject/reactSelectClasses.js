const reactSelectClasses = {
    control: ({ isFocused }) =>
        `min-h-[48px] px-2 rounded-lg border ${
            isFocused
                ? "border-sky-400"
                : "border-(--border)"
        } bg-(--secondary-bg)`,

    valueContainer: () =>
        "gap-1 px-2",

    placeholder: () =>
        "text-(--text) opacity-60",

    input: () =>
        "text-(--text)",

    multiValue: () =>
        "bg-slate-700 rounded-md",

    multiValueLabel: () =>
        "text-white px-2 py-1",

    multiValueRemove: () =>
        "text-white hover:bg-red-500 hover:text-white rounded-r-md",

    menu: () =>
        "bg-(--secondary-bg) border border-(--border) rounded-lg mt-2 overflow-hidden z-50",

    menuList: () =>
        "max-h-60",

    option: ({ isFocused, isSelected }) =>
        `px-4 py-3 cursor-pointer ${
            isSelected
                ? "bg-sky-500 text-black"
                : isFocused
                ? "bg-slate-700 text-white"
                : "text-(--text)"
        }`,

    singleValue: () =>
        "text-(--text)",

    clearIndicator: () =>
        "text-gray-400 hover:text-red-400",

    dropdownIndicator: () =>
        "text-gray-400 hover:text-white",
};

export default reactSelectClasses;