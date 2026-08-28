import React, { useState } from "react";
import { FiUsers, FiUserPlus, FiX } from "react-icons/fi";
import Avatar from "../Utils/Avatar";
import AddMemberModal from "../TeamDetails/AddMemberModal";

export default function TeamMembersSelect({
  selectedMembers = [],
  onMembersChange,
  teamName = "Untitled Team",
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddMembers = async (memberIds) => {
    // Merge existing member IDs with newly selected ones
    const existingIds = new Set(selectedMembers.map((m) => m._id || m.id || m));
    const allIds = Array.from(new Set([...existingIds, ...memberIds]));
    
    // We pass the full objects/IDs back to parent
    if (onMembersChange) {
      onMembersChange(allIds);
    }
  };

  const handleRemoveMember = (mId) => {
    const updated = selectedMembers.filter((m) => (m._id || m.id || m) !== mId);
    if (onMembersChange) {
      onMembersChange(updated);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-slate-800/80 bg-[#0A0C10] text-slate-200 shadow-xl">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <FiUsers className="text-emerald-400 text-lg" />
          <h3 className="text-sm font-bold text-white font-(family-name:--headers)">
            Team Members
          </h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            {selectedMembers.length} Selected
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#ADC6FF] hover:bg-[#8eb2ff] text-[#002E6A] font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/10 cursor-pointer font-mono"
        >
          <FiUserPlus className="text-xs stroke-[2.5]" />
          <span>+ Add Members</span>
        </button>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed font-(family-name:--body-font)">
        Provision engineers and developers into this operational unit for ownership governance.
      </p>

      {/* Selected Members Roster Chips */}
      {selectedMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 text-slate-500 font-mono text-xs gap-2">
          <FiUsers className="text-2xl text-slate-600" />
          <p>No additional members assigned yet.</p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-emerald-400 hover:text-emerald-300 font-semibold uppercase text-[11px] underline cursor-pointer"
          >
            Click here to select members
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto">
          {selectedMembers.map((m, idx) => {
            const mId = m._id || m.id || (typeof m === "string" ? m : `m-${idx}`);
            const name = m.name || (typeof m === "string" ? `Engineer ${idx + 1}` : `${m.firstName || ""} ${m.lastName || ""}`.trim() || m.email);
            const username = m.username || (m.email ? m.email.split("@")[0] : `member_${idx + 1}`);
            const role = m.role || "Developer";

            return (
              <div
                key={mId}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-[#12151e] hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar
                    avatarUrl={m.avatar}
                    name={name}
                    size="w-6 h-6 text-[9px]"
                    className="bg-slate-800 text-slate-300"
                  />
                  <div className="min-w-0">
                    <span className="font-bold text-white text-xs block truncate">
                      {name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate font-mono">
                      @{username} • {role}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveMember(mId)}
                  className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                  title="Remove member"
                >
                  <FiX className="text-xs" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Existing Members Modal */}
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMembers={handleAddMembers}
        currentMembers={selectedMembers}
        teamName={teamName}
      />
    </div>
  );
}
