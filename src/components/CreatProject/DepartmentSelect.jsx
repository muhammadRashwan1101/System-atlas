import Select from "react-select";
import { departmentOptions } from "./projectOptions";
import reactSelectClasses from "./reactSelectClasses";

export default function DepartmentSelect({
  value,
  onChange,
  setProjectSummary,
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm ms-2">
        Departments
      </label>

    <Select
  unstyled
  isMulti
  options={departmentOptions}
  value={value}
  placeholder="Select Departments..."

  closeMenuOnSelect={false}
  blurInputOnSelect={false}
  hideSelectedOptions={false}

  classNames={reactSelectClasses}

  onChange={(selected) => {
    const values = selected || [];

    onChange(values);

    setProjectSummary((prev) => ({
      ...prev,
      departments: values.map((item) => item.value),
    }));
  }}
/>
    </div>
  );
}