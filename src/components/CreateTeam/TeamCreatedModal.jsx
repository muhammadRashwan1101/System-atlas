import { FiCheckCircle, FiUsers, FiArrowRight, FiX, FiPlus } from "react-icons/fi";

export default function TeamCreatedModal({
    isOpen,
    team,
    onAddMembers,
    onGoToTeam,
    onCreateAnother,
    onClose,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-[520px] rounded-2xl border border-slate-800 bg-[#0d0f14] shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="relative border-b border-slate-800 px-8 py-7">

                    <button
                        onClick={onClose}
                        className="absolute right-5 top-5 text-slate-500 hover:text-white transition"
                    >
                        <FiX size={20} />
                    </button>

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <FiCheckCircle className="text-4xl text-emerald-400" />
                    </div>

                    <h2 className="mt-5 text-center text-2xl font-semibold text-white">
                        Team Created Successfully
                    </h2>

                    <p className="mt-2 text-center text-sm text-slate-400">
                        Your new team has been created successfully.
                    </p>

                </div>


                {/* Body */}
                <div className="px-8 py-6">

                    <div className="rounded-xl border border-slate-800 bg-[#11141a] p-5">

                        <p className="text-xs uppercase tracking-widest text-slate-500">
                            Team Name
                        </p>

                        <p className="mt-2 text-lg font-semibold text-white">
                            {team?.teamName}
                        </p>

                        <div className="mt-4 flex gap-2">

                            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                                {team?.teamCode}
                            </span>

                            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                                {team?.category}
                            </span>

                        </div>

                    </div>


                    {/* Actions */}
                    <div className="mt-8 space-y-3">

                        {/* Add Members */}
                        <button
                            onClick={onAddMembers}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b9ccff] px-5 py-3 font-semibold text-slate-900 transition hover:bg-[#a7bfff]"
                        >
                            <FiUsers />
                            Add Members
                        </button>


                        {/* Go To Team */}
                        <button
                            onClick={onGoToTeam}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-white transition hover:bg-slate-800"
                        >
                            <FiArrowRight />
                            Go To Team
                        </button>


                        {/* Create Another Team */}
                        {/* Create Another Team */}
                        <button
                            onClick={onCreateAnother}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-white transition hover:bg-slate-800"
                        >
                            <FiPlus />
                            Create Another Team
                        </button>


                        {/* Later */}
                        <button
                            onClick={onClose}
                            className="w-full py-2 text-sm text-slate-500 hover:text-white transition"
                        >
                            I'll do it later
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
}