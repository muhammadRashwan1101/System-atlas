import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    FiSearch,
    FiX,
    FiUsers,
    FiCheck,
} from "react-icons/fi";

import { toast } from "react-toastify";

import api from "../../api/axios";

export default function AssignTeamsModal({
    isOpen,
    project,
    selectedDepartments = [],
    onClose,
    onAssigned,
}) {
    const [teams, setTeams] = useState([]);

    const [selectedTeams, setSelectedTeams] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [search, setSearch] =
        useState("");

    // =====================================================
    // Department Values
    // =====================================================

    const departmentValues = useMemo(() => {
        return selectedDepartments
            .map((department) => {
                if (
                    typeof department === "string"
                ) {
                    return department
                        .trim()
                        .toLowerCase();
                }

                return (
                    department?.value ||
                    department?.label ||
                    ""
                )
                    .toString()
                    .trim()
                    .toLowerCase();
            })
            .filter(Boolean);
    }, [selectedDepartments]);

    // =====================================================
    // Fetch Teams
    // =====================================================

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const fetchTeams = async () => {
            try {
                setLoading(true);

                const response =
                    await api.get("/teams");

                setTeams(
                    response.data?.teams || []
                );
            } catch (error) {
                console.error(
                    "Fetch teams error:",
                    error
                );

                toast.error(
                    error.response?.data?.msg ||
                    "Failed to load teams"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, [isOpen]);

    // =====================================================
    // Reset Modal
    // =====================================================

    const handleClose = () => {
        setSearch("");

        setSelectedTeams([]);

        onClose?.();
    };

    // =====================================================
    // Filter Teams By Department
    // =====================================================

    const departmentFilteredTeams =
        useMemo(() => {
            // لو مفيش Departments مختارة
            // نعرض كل التيمات
            if (
                departmentValues.length === 0
            ) {
                return teams;
            }

            return teams.filter((team) => {
                const category =
                    (
                        team?.category || ""
                    )
                        .toString()
                        .trim()
                        .toLowerCase();

                return departmentValues.includes(
                    category
                );
            });
        }, [
            teams,
            departmentValues,
        ]);

    // =====================================================
    // Search
    // =====================================================

    const filteredTeams = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        if (!query) {
            return departmentFilteredTeams;
        }

        return departmentFilteredTeams.filter(
            (team) => {
                const teamName =
                    team?.teamName
                        ?.toLowerCase() || "";

                const teamCode =
                    team?.teamCode
                        ?.toLowerCase() || "";

                const category =
                    team?.category
                        ?.toLowerCase() || "";

                return (
                    teamName.includes(query) ||
                    teamCode.includes(query) ||
                    category.includes(query)
                );
            }
        );
    }, [
        departmentFilteredTeams,
        search,
    ]);

    // =====================================================
    // Toggle Team
    // =====================================================

    const handleToggleTeam = (team) => {
        setSelectedTeams((prev) => {
            const exists = prev.some(
                (item) =>
                    item._id === team._id
            );

            if (exists) {
                return prev.filter(
                    (item) =>
                        item._id !== team._id
                );
            }

            return [
                ...prev,
                team,
            ];
        });
    };

    // =====================================================
    // Remove Selected Team
    // =====================================================

    const handleRemoveTeam = (teamId) => {
        setSelectedTeams((prev) =>
            prev.filter(
                (team) =>
                    team._id !== teamId
            )
        );
    };

    // =====================================================
    // Assign Teams
    // =====================================================

    const handleAssignTeams = async () => {
        if (!project?._id) {
            toast.error(
                "Project not found."
            );

            return;
        }

        if (
            selectedTeams.length === 0
        ) {
            toast.warning(
                "Please select at least one team."
            );

            return;
        }

        try {
            setSubmitting(true);

            const teamIds =
                selectedTeams.map(
                    (team) => team._id
                );

            console.log(
                "Assign Teams:",
                {
                    projectId:
                        project._id,

                    teamIds,
                }
            );

            /*
             * الـ API بتاع assignment هنضيفه هنا
             * بعد ما نثبت الـ backend endpoint.
             *
             * حاليًا بنعتبر الاختيار ناجح.
             */

            toast.success(
                "Teams selected successfully!"
            );

            onAssigned?.(
                selectedTeams
            );

        } catch (error) {
            console.error(
                "Assign teams error:",
                error
            );

            toast.error(
                error.response?.data?.msg ||
                "Failed to assign teams"
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =====================================================
    // Don't Render
    // =====================================================

    if (!isOpen) {
        return null;
    }

    // =====================================================
    // Render
    // =====================================================

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-[95vw] max-w-5xl h-[80vh] bg-[#0B0E15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* ================================================= */}
                {/* Header */}
                {/* ================================================= */}

                <header className="flex items-center justify-between px-7 py-5 border-b border-slate-800/70">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Assign Teams
                        </h2>

                        <p className="text-sm text-slate-400 mt-1">
                            Select teams that belong to the selected departments.
                        </p>

                        <p className="text-xs text-slate-600 mt-2">
                            Project:{" "}
                            <span className="text-slate-400">
                                {project?.name}
                            </span>
                        </p>

                        {/* ================================================= */}
                        {/* Departments */}
                        {/* ================================================= */}

                        {departmentValues.length >
                            0 && (
                            <div className="flex flex-wrap gap-2 mt-3">

                                <span className="text-xs text-slate-500">
                                    Departments:
                                </span>

                                {selectedDepartments.map(
                                    (
                                        department,
                                        index
                                    ) => (
                                        <span
                                            key={
                                                department?._id ||
                                                department?.value ||
                                                index
                                            }
                                            className="px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-300"
                                        >
                                            {department?.label ||
                                                department?.value ||
                                                department}
                                        </span>
                                    )
                                )}

                            </div>
                        )}

                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                        <FiX size={21} />
                    </button>

                </header>

                {/* ================================================= */}
                {/* Search */}
                {/* ================================================= */}

                <section className="px-7 py-4 border-b border-slate-800/60">

                    <div className="flex items-center gap-3 bg-[#11141c] border border-slate-800 rounded-xl px-4 py-3">

                        <FiSearch className="text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                            placeholder="Search teams by name, code, or category..."
                            className="w-full bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                                className="text-xs text-slate-500 hover:text-white"
                            >
                                Clear
                            </button>
                        )}

                    </div>

                </section>

                {/* ================================================= */}
                {/* Main */}
                {/* ================================================= */}

                <main className="flex flex-1 min-h-0 overflow-hidden">

                    {/* ================================================= */}
                    {/* Teams */}
                    {/* ================================================= */}

                    <div className="w-full md:w-[65%] border-r border-slate-800/60 flex flex-col">

                        <div className="grid grid-cols-[2fr_1fr_1fr] px-6 py-3 text-[10px] uppercase tracking-wider font-semibold text-slate-500 border-b border-slate-800/60">

                            <span>
                                Team
                            </span>

                            <span>
                                Category
                            </span>

                            <span className="text-right">
                                Members
                            </span>

                        </div>

                        <div className="flex-1 overflow-y-auto">

                            {loading ? (

                                <div className="flex items-center justify-center h-full text-sm text-slate-500">
                                    Loading teams...
                                </div>

                            ) : filteredTeams.length ===
                              0 ? (

                                <div className="flex flex-col items-center justify-center h-full text-center px-6">

                                    <FiUsers
                                        size={30}
                                        className="text-slate-700 mb-3"
                                    />

                                    <p className="text-sm text-slate-500">
                                        No teams found for the selected departments.
                                    </p>

                                    <p className="text-xs text-slate-600 mt-2">
                                        Make sure the team category matches the department.
                                    </p>

                                </div>

                            ) : (

                                filteredTeams.map(
                                    (team) => {

                                        const isSelected =
                                            selectedTeams.some(
                                                (
                                                    item
                                                ) =>
                                                    item._id ===
                                                    team._id
                                            );

                                        const membersCount =
                                            Array.isArray(
                                                team.members
                                            )
                                                ? team.members.length
                                                : 0;

                                        return (
                                            <div
                                                key={
                                                    team._id
                                                }
                                                onClick={() =>
                                                    handleToggleTeam(
                                                        team
                                                    )
                                                }
                                                className={`grid grid-cols-[2fr_1fr_1fr] items-center px-6 py-4 border-b border-slate-800/40 cursor-pointer transition ${
                                                    isSelected
                                                        ? "bg-slate-800/50"
                                                        : "hover:bg-slate-800/20"
                                                }`}
                                            >

                                                {/* Team */}

                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                                            isSelected
                                                                ? "bg-emerald-500/20 text-emerald-400"
                                                                : "bg-slate-800 text-slate-400"
                                                        }`}
                                                    >
                                                        {isSelected ? (
                                                            <FiCheck />
                                                        ) : (
                                                            <FiUsers />
                                                        )}
                                                    </div>

                                                    <div>

                                                        <p className="text-sm font-medium text-slate-200">
                                                            {team.teamName}
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            {team.teamCode}
                                                        </p>

                                                    </div>

                                                </div>

                                                {/* Category */}

                                                <div>

                                                    <span className="px-2 py-1 rounded border border-slate-700 bg-slate-800 text-xs text-slate-400">
                                                        {team.category ||
                                                            "N/A"}
                                                    </span>

                                                </div>

                                                {/* Members */}

                                                <div className="text-right text-xs text-slate-400">

                                                    {membersCount}{" "}
                                                    members

                                                </div>

                                            </div>
                                        );
                                    }
                                )

                            )}

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* Selected Teams */}
                    {/* ================================================= */}

                    <aside className="hidden md:flex md:w-[35%] bg-[#0d0f17] p-5 flex-col">

                        <div className="flex items-center justify-between mb-4">

                            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                                Selected Teams (
                                {
                                    selectedTeams.length
                                }
                                )
                            </h3>

                            {selectedTeams.length >
                                0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedTeams(
                                            []
                                        )
                                    }
                                    className="text-xs text-slate-400 hover:text-white"
                                >
                                    Clear all
                                </button>
                            )}

                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">

                            {selectedTeams.length ===
                            0 ? (

                                <div className="text-center text-xs text-slate-600 py-10">
                                    No teams selected yet.
                                </div>

                            ) : (

                                selectedTeams.map(
                                    (team) => (

                                        <div
                                            key={
                                                team._id
                                            }
                                            className="flex items-center justify-between p-3 rounded-xl bg-[#11141c] border border-slate-800"
                                        >

                                            <div className="flex items-center gap-3">

                                                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                                    <FiUsers />
                                                </div>

                                                <div>

                                                    <p className="text-sm text-slate-200">
                                                        {team.teamName}
                                                    </p>

                                                    <p className="text-xs text-slate-500">
                                                        {team.category ||
                                                            "N/A"}
                                                    </p>

                                                </div>

                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveTeam(
                                                        team._id
                                                    )
                                                }
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <FiX />
                                            </button>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </aside>

                </main>

                {/* ================================================= */}
                {/* Footer */}
                {/* ================================================= */}

                <footer className="h-[68px] flex items-center justify-between px-7 border-t border-slate-800/80 bg-[#090b10]">

                    <div className="flex items-center gap-2 text-sm text-slate-400">

                        <FiUsers />

                        <span>
                            Selected:
                        </span>

                        <span className="text-white font-semibold">
                            {
                                selectedTeams.length
                            }
                        </span>

                    </div>

                    <div className="flex gap-3">

                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2 rounded-lg border border-slate-800 text-sm text-slate-300 hover:bg-slate-800/40 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={
                                handleAssignTeams
                            }
                            disabled={
                                selectedTeams.length ===
                                    0 ||
                                submitting
                            }
                            className="px-6 py-2 rounded-lg bg-[#b9ccff] text-slate-900 font-semibold text-sm hover:bg-[#a6beff] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting
                                ? "Assigning..."
                                : `Assign Teams (${selectedTeams.length})`}
                        </button>

                    </div>

                </footer>

            </div>

        </div>
    );
}