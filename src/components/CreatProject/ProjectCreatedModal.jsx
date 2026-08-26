export default function ProjectCreatedModal({
    project,
    onClose,
    onAssignTeams,
    onCreateAnotherProject,
    onProjectManagement,
    onUserManagement,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">

            <div className="w-[500px] max-w-[90%] rounded-2xl border border-(--border) bg-(--secondary-bg) p-7 text-white shadow-2xl">

                {/* ================================================= */}
                {/* Header */}
                {/* ================================================= */}

                <div className="flex items-start justify-between">

                    <div>

                        <h2 className="text-2xl font-bold">
                            Project Created
                        </h2>

                        <p className="mt-2 text-sm text-(--text) opacity-70">
                            {project?.name}
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-white text-2xl transition"
                    >
                        ×
                    </button>

                </div>

                {/* ================================================= */}
                {/* Options */}
                {/* ================================================= */}

                <div className="grid gap-3 mt-7">

                    {/* ================================================= */}
                    {/* Assign Teams */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        onClick={onAssignTeams}
                        className="w-full p-3.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition font-medium"
                    >
                        Assign Teams
                    </button>

                    {/* ================================================= */}
                    {/* Create Another Project */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        onClick={onCreateAnotherProject}
                        className="w-full p-3.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition font-medium"
                    >
                        Create Another Project
                    </button>

                    {/* ================================================= */}
                    {/* Project Management */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        onClick={onProjectManagement}
                        className="w-full p-3.5 rounded-lg bg-slate-700 hover:bg-slate-600 transition font-medium"
                    >
                        Project Management
                    </button>

                    {/* ================================================= */}
                    {/* User Management */}
                    {/* ================================================= */}

                    <button
                        type="button"
                        onClick={onUserManagement}
                        className="w-full p-3.5 rounded-lg bg-sky-100 text-black font-medium hover:scale-[1.02] transition"
                    >
                        User Management
                    </button>

                </div>

            </div>

        </div>
    );
}