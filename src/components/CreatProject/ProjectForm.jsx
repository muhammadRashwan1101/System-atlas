import {
    useState,
    useEffect,
} from "react";

import {
    FiPlusCircle,
} from "react-icons/fi";

import DatePicker from "react-datepicker";

import {
    useForm,
} from "react-hook-form";

import {
    toast,
} from "react-toastify";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import api from "../../api/axios";

import {
    TARGET_ENVIRONMENT_OPTIONS,
    TOPOLOGY_OPTIONS,
} from "./projectOptions";

import EnvironmentCards from "./EnvironmentCards";

import TopologyCards from "./TopologyCards";

import DepartmentSelect from "./DepartmentSelect";

import ProjectCreatedModal from "./ProjectCreatedModal";

import AssignTeamsModal from "./AssignTeamsModal";

import "react-datepicker/dist/react-datepicker.css";

export default function ProjectForm({
    projectSummary,
    setProjectSummary,
}) {
    const {
        workspaceId,
    } = useParams();

    const navigate =
        useNavigate();

    // =====================================================
    // Form
    // =====================================================

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: {
            errors,
        },
    } = useForm({
        mode: "onSubmit",
        reValidateMode: "onSubmit",
    });

    // =====================================================
    // Project Form States
    // =====================================================

    const [
        selectedDepartments,
        setSelectedDepartments,
    ] = useState([]);

    const [
        startDate,
        setStartDate,
    ] = useState(null);

    const [
        endDate,
        setEndDate,
    ] = useState(null);

    const [
        targetEnvironment,
        setTargetEnvironment,
    ] = useState("");

    const [
        systemTopology,
        setSystemTopology,
    ] = useState("");

    // =====================================================
    // Created Project
    // =====================================================

    const [
        createdProject,
        setCreatedProject,
    ] = useState(null);

    // =====================================================
    // Project Created Modal
    // =====================================================

    const [
        showProjectOptions,
        setShowProjectOptions,
    ] = useState(false);

    // =====================================================
    // Assign Teams Modal
    // =====================================================

    const [
        showAssignTeams,
        setShowAssignTeams,
    ] = useState(false);

    // =====================================================
    // Manager Name
    // =====================================================

    const managerName =
        watch("managerName");

    useEffect(() => {
        setProjectSummary(
            (prev) => ({
                ...prev,

                managerName:
                    managerName || "",
            })
        );
    }, [
        managerName,
        setProjectSummary,
    ]);

    // =====================================================
    // Build Project Data
    // =====================================================

    const buildProjectData = (
        data
    ) => ({
        name:
            data.name,

        description:
            data.description,

        managerName:
            data.managerName,

        startDate:
            startDate?.toISOString(),

        endDate:
            endDate?.toISOString(),

        departments:
            selectedDepartments.map(
                (item) =>
                    item.value
            ),

        targetEnvironment,

        systemTopology,
    });

    // =====================================================
    // Create Project
    // =====================================================

    const handleProjectSubmit =
        async (data) => {
            try {
                const projectData =
                    buildProjectData(
                        data
                    );

                console.log(
                    "Project Data:",
                    projectData
                );

                const response =
                    await api.post(
                        `/workspaces/${workspaceId}/projects`,
                        projectData
                    );

                const project =
                    response.data
                        ?.project;

                if (
                    !project?._id
                ) {
                    throw new Error(
                        "Project was created but project ID was not returned."
                    );
                }

                setCreatedProject(
                    project
                );

                setShowProjectOptions(
                    true
                );

                toast.success(
                    "Project initialized successfully"
                );

            } catch (err) {
                console.error(
                    "Create project error:",
                    err
                );

                const message =
                    err.response
                        ?.data?.msg ||
                    err.message ||
                    "Failed to create project";

                if (
                    Array.isArray(
                        message
                    )
                ) {
                    message.forEach(
                        (msg) =>
                            toast.error(
                                msg
                            )
                    );
                } else {
                    toast.error(
                        message
                    );
                }
            }
        };

    // =====================================================
    // Department Change
    // =====================================================

    const handleDepartmentsChange =
        (departments) => {
            setSelectedDepartments(
                departments
            );
        };

    // =====================================================
    // Assign Teams
    // =====================================================

    const handleAssignTeams =
        () => {
            if (
                !createdProject?._id
            ) {
                toast.error(
                    "Project not found."
                );

                return;
            }

            // Close Project Created Modal
            setShowProjectOptions(
                false
            );

            // Open Assign Teams Modal
            setShowAssignTeams(
                true
            );
        };

    // =====================================================
    // Teams Assigned
    // =====================================================

    const handleTeamsAssigned =
        (assignedTeams) => {
            console.log(
                "Assigned Teams:",
                assignedTeams
            );

            setShowAssignTeams(
                false
            );

            /*
             * بعد الـ Assign مباشرةً
             * نروح لـ Team Management.
             */

            navigate(
                `/workspaces/${workspaceId}/dashboard`
            );
        };

    // =====================================================
    // Close Assign Teams
    // =====================================================

    const handleCloseAssignTeams =
        () => {
            setShowAssignTeams(
                false
            );

            /*
             * لو المستخدم قفل Assign Teams
             * نرجعه للـ Project Created Modal.
             */

            setShowProjectOptions(
                true
            );
        };

    // =====================================================
    // Create Another Project
    // =====================================================

    const handleCreateAnotherProject =
        () => {

            // Close modals
            setShowProjectOptions(
                false
            );

            setShowAssignTeams(
                false
            );

            // Clear created project
            setCreatedProject(
                null
            );

            // Clear react-hook-form
            reset();

            // Clear dates
            setStartDate(
                null
            );

            setEndDate(
                null
            );

            // Clear departments
            setSelectedDepartments(
                []
            );

            // Clear environment
            setTargetEnvironment(
                ""
            );

            // Clear topology
            setSystemTopology(
                ""
            );

            // Clear summary
            setProjectSummary(
                {}
            );

            // Make sure we are on Create Project
            navigate(
                `/workspaces/${workspaceId}/new-project`
            );
        };

    // =====================================================
    // Project Management
    // =====================================================

    const handleProjectManagement =
        () => {
            /*
             * هنسيبها مؤقتًا لحد ما نحدد
             * Route الخاص بـ Project Management.
             */

            toast.info(
                "Project Management page will be connected next."
            );
        };

    // =====================================================
    // User Management
    // =====================================================

    const handleUserManagement =
        () => {
            /*
             * هنسيبها مؤقتًا لحد ما نحدد
             * Route الخاص بـ User Management.
             */

            toast.info(
                "User Management page will be connected next."
            );
        };

    // =====================================================
    // Configure Architecture
    // =====================================================

    const handleConfigureArchitecture =
        () => {
            console.log(
                "Configure Architecture:",
                createdProject?._id
            );
        };

    // =====================================================
    // Add Components
    // =====================================================

    const handleAddComponents =
        () => {
            console.log(
                "Add Components:",
                createdProject?._id
            );
        };

    // =====================================================
    // View Project
    // =====================================================

    const handleViewProject =
        () => {
            if (
                !createdProject?._id
            ) {
                return;
            }

            setShowProjectOptions(
                false
            );

            navigate(
                `/workspaces/${workspaceId}/projects/${createdProject._id}`
            );
        };

    // =====================================================
    // Close Project Options
    // =====================================================

    const handleCloseProjectOptions =
        () => {
            setShowProjectOptions(
                false
            );
        };

    // =====================================================
    // Render
    // =====================================================

    return (
        <div className="flex flex-col w-full h-full p-5 text-white">

            <div className="w-2/3 h-full ms-25">

                {/* ================================================= */}
                {/* Header */}
                {/* ================================================= */}

                <h2 className="text-3xl font-bold text-white text-shadow-[0_0px_18px_rgba(138,175,207,0.5)]">
                    Create Project
                </h2>

                <p className="text-(--text) mt-2">
                    Create an organizational boundary for
                    architecture governance and ownership.
                </p>

                {/* ================================================= */}
                {/* Form */}
                {/* ================================================= */}

                <form
                    onSubmit={
                        handleSubmit(
                            handleProjectSubmit
                        )
                    }
                >

                    {/* ================================================= */}
                    {/* Project Name */}
                    {/* ================================================= */}

                    <div className="flex flex-col gap-4 mt-7">

                        <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
                            Project Name
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. E-Commerce Platform"

                            {...register(
                                "name",
                                {
                                    required:
                                        "Project name is required",
                                }
                            )}

                            className="p-3 border border-(--border) rounded bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg)"
                        />

                        {errors.name && (
                            <p className="text-red-500 text-xs">
                                {
                                    errors
                                        .name
                                        .message
                                }
                            </p>
                        )}

                    </div>

                    {/* ================================================= */}
                    {/* Description */}
                    {/* ================================================= */}

                    <div className="flex flex-col gap-4 mt-5">

                        <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
                            Description
                        </label>

                        <textarea
                            rows={4}
                            placeholder="Brief technical summary..."

                            {...register(
                                "description",
                                {
                                    required:
                                        "Description is required",
                                }
                            )}

                            className="p-5 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) resize-none focus:outline-none focus:border-(--main-bg)"
                        />

                        {errors.description && (
                            <p className="text-red-500 text-xs">
                                {
                                    errors
                                        .description
                                        .message
                                }
                            </p>
                        )}

                    </div>

                    {/* ================================================= */}
                    {/* Dates */}
                    {/* ================================================= */}

                    <div className="flex gap-10">

                        {/* Start Date */}

                        <div>

                            <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm mb-3 block mt-6">
                                Start Date
                            </label>

                            <DatePicker
                                selected={
                                    startDate
                                }

                                onChange={
                                    setStartDate
                                }

                                dateFormat="dd/MM/yyyy"

                                placeholderText="DD/MM/YYYY"

                                className="w-50 p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text)"
                            />

                        </div>

                        {/* End Date */}

                        <div>

                            <label className="font-(family-name:--labels) uppercase text-(--primary) text-sm mb-3 block mt-6">
                                End Date
                            </label>

                            <DatePicker
                                selected={
                                    endDate
                                }

                                onChange={
                                    setEndDate
                                }

                                dateFormat="dd/MM/yyyy"

                                placeholderText="DD/MM/YYYY"

                                className="w-50 p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text)"
                            />

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* Environment */}
                    {/* ================================================= */}

                    <EnvironmentCards
                        options={
                            TARGET_ENVIRONMENT_OPTIONS
                        }

                        selected={
                            targetEnvironment
                        }

                        setSelected={
                            setTargetEnvironment
                        }

                        setProjectSummary={
                            setProjectSummary
                        }
                    />

                    {/* ================================================= */}
                    {/* Topology */}
                    {/* ================================================= */}

                    <TopologyCards
                        options={
                            TOPOLOGY_OPTIONS
                        }

                        selected={
                            systemTopology
                        }

                        setSelected={
                            setSystemTopology
                        }

                        setProjectSummary={
                            setProjectSummary
                        }
                    />

                    {/* ================================================= */}
                    {/* Manager + Departments */}
                    {/* ================================================= */}

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

                                {...register(
                                    "managerName",
                                    {
                                        required:
                                            "Manager name is required",
                                    }
                                )}

                                className="w-full p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text)"
                            />

                            {errors.managerName && (
                                <p className="text-red-500 text-xs">
                                    {
                                        errors
                                            .managerName
                                            .message
                                    }
                                </p>
                            )}

                        </div>

                        {/* Departments */}

                        <DepartmentSelect
                            value={
                                selectedDepartments
                            }

                            onChange={
                                handleDepartmentsChange
                            }

                            setProjectSummary={
                                setProjectSummary
                            }
                        />

                    </div>

                    {/* ================================================= */}
                    {/* Footer */}
                    {/* ================================================= */}

                    <div className="flex justify-between items-center mt-8 text-[#FF8A80]">

                        <button
                            type="button"

                            onClick={() =>
                                navigate(
                                    workspaceId
                                        ? `/workspaces/${workspaceId}`
                                        : "/dashboard"
                                )
                            }

                            className="cursor-pointer hover:underline"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"

                            className="w-50 p-3 rounded-lg bg-sky-100 text-black font-medium border transition hover:scale-105 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)] flex items-center justify-center gap-2"
                        >
                            <FiPlusCircle
                                size={20}
                            />

                            Initialize Project
                        </button>

                    </div>

                </form>

            </div>

            {/* ===================================================== */}
            {/* Project Created Modal */}
            {/* ===================================================== */}

            {showProjectOptions &&
                createdProject && (

                    <ProjectCreatedModal
                        project={
                            createdProject
                        }

                        onClose={
                            handleCloseProjectOptions
                        }

                        onAssignTeams={
                            handleAssignTeams
                        }

                        onCreateAnotherProject={
                            handleCreateAnotherProject
                        }

                        onProjectManagement={
                            handleProjectManagement
                        }

                        onUserManagement={
                            handleUserManagement
                        }
                    />

                )}

            {/* ===================================================== */}
            {/* Assign Teams Modal */}
            {/* ===================================================== */}

            {showAssignTeams &&
                createdProject && (

                    <AssignTeamsModal
                        isOpen={
                            showAssignTeams
                        }

                        project={
                            createdProject
                        }

                        selectedDepartments={
                            selectedDepartments
                        }

                        onClose={
                            handleCloseAssignTeams
                        }

                        onAssigned={
                            handleTeamsAssigned
                        }
                    />

                )}

        </div>
    );
}