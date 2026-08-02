import { useState, useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { TARGET_ENVIRONMENT_OPTIONS, TOPOLOGY_OPTIONS, departmentOptions, } from "./projectOptions";
import reactSelectClasses from "./reactSelectClasses";
import EnvironmentCards from "./EnvironmentCards";
import TopologyCards from "./TopologyCards";
import DepartmentSelect from "./DepartmentSelect";
import "react-datepicker/dist/react-datepicker.css";
export default function ProjectForm({
    projectSummary,
    setProjectSummary,
}) {
    const { workspaceId } = useParams();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [targetEnvironment, setTargetEnvironment] = useState("");
    const [systemTopology, setSystemTopology] = useState("");
    const [error, setError] = useState(null);

    const managerName = watch("managerName");

    useEffect(() => {
        setProjectSummary((prev) => ({
            ...prev,
            managerName: managerName || "",
        }));
    }, [managerName, setProjectSummary]);
    const buildProjectData = (data) => ({
        name: data.name,
        description: data.description,
        managerName: data.managerName,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        departments: selectedDepartments.map((item) => item.value),
        targetEnvironment,
        systemTopology,
    });

    const handleProjectSubmit = async (data) => {
        try {
            const response = await api.post(
                `/workspaces/${workspaceId}/projects`,
                buildProjectData(data)
            );


            toast.success("Project initialized successfully");

        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="flex flex-col w-full h-full p-5 text-white">
            <div className="w-2/3 h-full ms-25">
                <h2 className="text-3xl font-bold text-white text-shadow-[0_0px_18px_rgba(138,175,207,0.5)]">
                    Create Project
                </h2>
                <p className="text-(--text) mt-2">
                    Create an organizational boundary for architecture governance and ownership.
                </p>
                <form onSubmit={handleSubmit(handleProjectSubmit)}>
                    {/* ================= Project Name ================= */}
                    <div className="flex flex-col gap-4 mt-7">
                        <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
                            Project Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. E-Commerce Platform"
                            {...register("name", {
                                required: "Project name is required",
                            })}
                            className="p-3 border border-(--border) rounded bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg)"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* ================= Description ================= */}
                    <div className="flex flex-col gap-4 mt-5">
                        <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
                            Description
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Brief technical summary..."
                            {...register("description", {
                                required: "Description is required",
                            })}
                            className="p-5 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) resize-none focus:outline-none focus:border-(--main-bg)"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-xs">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                    {/* ================= Dates ================= */}
                    <div className="flex gap-10">
                        <div>
                            <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm mb-3 block mt-6">
                                Start Date
                            </label>
                            <DatePicker
                                selected={startDate}
                                onChange={setStartDate}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                className="w-50 p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text)"
                            />
                        </div>
                        <div>
                            <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm mb-3 block mt-6">
                                End Date
                            </label>
                            <DatePicker
                                selected={endDate}
                                onChange={setEndDate}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                className="w-50 p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text)"
                            />
                        </div>
                    </div>
                    <EnvironmentCards
                        options={TARGET_ENVIRONMENT_OPTIONS}
                        selected={targetEnvironment}
                        setSelected={setTargetEnvironment}
                        setProjectSummary={setProjectSummary}
                    />
                    <TopologyCards
                        options={TOPOLOGY_OPTIONS}
                        selected={systemTopology}
                        setSelected={setSystemTopology}
                        setProjectSummary={setProjectSummary}
                    />

                    {/* ================= Manager + Departments Grid ================= */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                        {/* Manager */}

                        <div className="flex flex-col gap-2">

                            <label
                                htmlFor="ManagerName"
                                className="font-(family-name:--labels) uppercase text-(--primary) text-sm ms-2"
                            >
                                Project Manager
                            </label>

                            <input
                                id="ManagerName"
                                type="text"
                                placeholder="Name"
                                {...register("managerName", {
                                    required: "Manager name is required",
                                })}
                                className="w-full p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text)"
                            />

                            {errors.managerName && (
                                <p className="text-red-500 text-xs">
                                    {errors.managerName.message}
                                </p>
                            )}

                        </div>

                        <DepartmentSelect
                            value={selectedDepartments}
                            onChange={setSelectedDepartments}
                            setProjectSummary={setProjectSummary}
                        />

                    </div>
                    {/* ================= Footer / Actions ================= */}
                    <div className="flex justify-between items-center mt-8 text-[#FF8A80]">
                        <button
                            type="button"
                            onClick={() => navigate("/new-workspace")}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-50 p-3 rounded-lg bg-sky-100 text-black font-medium border transition hover:scale-105 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] flex items-center justify-center gap-2"
                        >
                            <FiPlusCircle size={20} />
                            Initialize Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}