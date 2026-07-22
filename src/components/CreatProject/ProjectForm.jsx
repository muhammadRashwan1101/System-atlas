import React, { useState, useEffect } from 'react';
import { MdOutlineRocketLaunch, MdOutlineLayers, MdTerminal, MdOutlineGrid4X4 } from "react-icons/md";
import { AiFillCodeSandboxSquare } from "react-icons/ai";
import { MdOutlineHub } from "react-icons/md";
import { GoZap } from "react-icons/go";
import { FiPlusCircle } from "react-icons/fi";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
const TARGET_ENVIRONMENT_OPTIONS = [
    {
        title: "Production Ready",
        value: "production ready",
        icon: MdOutlineRocketLaunch,
    },
    {
        title: "Prototype",
        value: "prototype",
        icon: MdOutlineLayers,
    },
    {
        title: "Development",
        value: "development",
        icon: MdTerminal,
    },
];

const TOPOLOGY_OPTIONS = [
    {
        title: "Monolithic",
        value: "monolithic",
        icon: AiFillCodeSandboxSquare,
    },
    {
        title: "Microservices",
        value: "microservices",
        icon: MdOutlineHub,
    },
    {
        title: "Event Driven",
        value: "event driven",
        icon: GoZap,
    },
    {
        title: "Hybrid",
        value: "hybrid",
        icon: MdOutlineGrid4X4,
    },
];
export default function ProjectForm({ projectSummary, setProjectSummary }) {
    const { workspaceId } = useParams();
    const {
        register,
        handleSubmit,
        watch,
        getValues,
        formState: { errors }
    } = useForm({
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [targetEnvironment, setTargetEnvironment] = useState("");
    const [systemTopology, setSystemTopology] = useState("");
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([
        "Platform",
        "Frontend",
        "Backend",
        "DevOps",
        "Cloud",
        "Mobile",
        "Security",
        "Data Science",
        "AI/ML",
        "UI/UX",
        "Engineering",
        "QA",
    ]);

    const projectName = watch("name");
    const managerName = watch("managerName");

    useEffect(() => {
        setProjectSummary((prev) => ({
            ...prev,
            name: projectName || "",
            managerName: managerName || "",
        }));
    }, [projectName, managerName, setProjectSummary]);
    const handleProjectSubmit = async (data) => {
        try {
            const projectData = {
                name: data.name,
                description: data.description,
                managerName: data.managerName,
                startDate: startDate ? startDate.toISOString() : null,
                endDate: endDate ? endDate.toISOString() : null,
                department: projectSummary.department,
                targetEnvironment,
                systemTopology,
            };

            const response = await api.post(
                `/workspaces/${workspaceId}/projects`,
                projectData
            );

            toast.success(
                response.data.msg || "Project initialized successfully"
            );

        } catch (err) {
            const message = Array.isArray(err.response?.data?.msg)
                ? err.response.data.msg.join(", ")
                : err.response?.data?.msg;

            setError(message || "Unable to connect to the server");
            toast.error(message || "Unable to connect to the server");
        }
    };

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);



    return (
        <div className='flex flex-col w-full h-full p-5 text-white'>
            <div className="w-2/3 h-full ms-25">
                <h2 className="text-3xl font-bold text-white text-shadow-[0_0px_18px_rgba(138,175,207,0.5)]">
                    Create Project
                </h2>
                <p className="text-(--text) mt-2">
                    Create an organizational boundary for architecture governance and ownership.
                </p>
                <form onSubmit={handleSubmit((data) => handleProjectSubmit(data, "initialize"))}>
                    {/* Project Name */}
                    <div className="flex flex-col gap-4 mt-7">
                        <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm">Project Name</label>
                        <input
                            type="text"
                            placeholder='e.g. E-Commerce Platform'
                            {...register("name", { required: "Project name is required" })}
                            className="p-3 border border-(--border) rounded bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg)"
                        />
                        {errors.name && (<p className="text-red-500 text-xs">{errors.name.message}</p>)}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-4 mt-5">
                        <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm">Description</label>
                        <textarea
                            placeholder='Brief technical summary...'
                            rows={4}
                            {...register("description", { required: "Description is required" })}
                            className="p-5 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg) resize-none"
                        />
                        {errors.description && (<p className="text-red-500 text-xs">{errors.description.message}</p>)}
                    </div>

                    {/* Dates */}
                    <div className="flex gap-10">
                        <div>
                            <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm mb-3 block mt-6">Start Date</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                className="w-50 p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text)"
                            />
                        </div>
                        <div>
                            <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm mb-3 block mt-6">End Date</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                className="w-50 p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text)"
                            />
                        </div>
                    </div>

                    {/* TARGET ENVIRONMENT */}
                    <div className='flex gap-4 mt-5'>
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm mb-2">
                                TARGET ENVIRONMENT
                            </h2>

                            <div className="flex flex-row gap-4 items-center flex-wrap">
                                {TARGET_ENVIRONMENT_OPTIONS.map((item) => (
                                    <div
                                        key={item.value}
                                        onClick={() => {
                                            setTargetEnvironment(item.value);

                                            setProjectSummary((prev) => ({
                                                ...prev,
                                                targetEnvironment: item.title,
                                            }));
                                        }}
                                        className={`p-5 flex flex-col items-center justify-center border rounded-lg cursor-pointer transition-all duration-300 w-50 h-25 ${targetEnvironment === item.value
                                            ? "border-sky-400 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-105"
                                            : "border-(--border) bg-(--secondary-bg)"
                                            }`}
                                    >
                                        <item.icon size={30} />

                                        <h1 className="text-xs mt-3 font-medium font-mono uppercase tracking-wide text-center">
                                            {item.title}
                                        </h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SYSTEM TOPOLOGY */}
                    <div className='flex gap-4 mt-5'>
                        <div className="flex flex-col gap-4 w-full">
                            <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm mb-2">
                                SYSTEM TOPOLOGY
                            </h2>
                            <div className="flex flex-row gap-4 items-center flex-wrap">
                                {TOPOLOGY_OPTIONS.map((item) => (
                                    <div
                                        key={item.value}
                                        onClick={() => {
                                            setSystemTopology(item.value);

                                            setProjectSummary((prev) => ({
                                                ...prev,
                                                systemTopology: item.title,
                                            }));
                                        }}
                                        className={`p-5 flex flex-col items-center justify-center border rounded-lg cursor-pointer transition-all duration-300 w-50 h-25 ${systemTopology === item.value
                                            ? "border-sky-400 bg-sky-500/10 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-105"
                                            : "border-(--border) bg-(--secondary-bg)"
                                            }`}
                                    >
                                        <item.icon size={30} />

                                        <h1 className="text-xs mt-3 font-medium font-mono tracking-wide text-center">
                                            {item.title}
                                        </h1>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">

                        {/* Project Manager */}
                        <div className="flex flex-col gap-2">
                            <label
                                htmlFor="ManagerName"
                                className="font-(family-name:--labels) uppercase text-(--primary) text-sm ms-2"
                            >
                                Project Manager
                            </label>

                            <input
                                type="text"
                                id="ManagerName"
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

                        {/* Department */}
                        <div className="flex flex-col gap-2">
                            <label
                                className="font-(family-name:--labels) uppercase text-(--primary) text-sm ms-2"
                            >
                                Department
                            </label>

                            <select
                                value={projectSummary.department}
                                onChange={(e) => {
                                    setProjectSummary((prev) => ({
                                        ...prev,
                                        department: e.target.value,
                                    }));
                                }}
                                className="w-full p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text)"
                            >
                                <option value="">Select Department</option>

                                {departments.map((dept, index) => (
                                    <option key={index} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>


                    <div className="flex justify-between items-center mt-8 text-[#FF8A80] ">
                        <button
                            type="button"
                            onClick={() => navigate("/new-workspace")}
                        >
                            Cancel
                        </button>
                        <div className="flex items-center gap-3">
                            <button type="submit" className="w-50 p-3 rounded-lg bg-sky-100 text-black font-medium border transition hover:scale-105 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] flex items-center justify-center gap-2">
                                <FiPlusCircle size={20} />
                                Initialize Project
                            </button>
                        </div>
                    </div>
                </form>
            </div >
        </div >
    );
}