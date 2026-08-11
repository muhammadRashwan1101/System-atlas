import { AiOutlineClose } from "react-icons/ai";
import { BsBuilding, BsCircleFill } from "react-icons/bs";
import { HiOutlineFolder, HiChevronRight } from "react-icons/hi";
import { MdOutlineSecurity } from "react-icons/md";
import { FiTerminal } from "react-icons/fi";
import profilepic from "../../assets/profile-pic/profliePic.png";

import HandleButtons from "./HandleButtons";

const projects = [
  { name: "Internal Core Engine", access: "Read Only", icon: "terminal" },
  { name: "System Topology Map", access: "Owner", icon: "folder" },
];

function Toggle({ defaultChecked }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="sr-only peer"
      />
      <div className="w-9 h-5 bg-[#2D303A] border border-[#4EDEA3]/40 peer-checked:bg-[#4EDEA3]/20  rounded-full transition-colors duration-200"></div>
      <div className="absolute left-0.5 top-0.5 w-4 h-4 peer-checked:bg-[#4EDEA3] rounded-full transition-transform duration-200 peer-checked:translate-x-4 bg-[#878991]"></div>
    </label>
  );
}

const statusStyles = {
  active: "text-[#4EDEA3] border-[#4EDEA333] bg-[#4EDEA333]",
  pending: "text-[#D8E2FF] border-[#D8E2FF33] bg-[#D8E2FF1A]",
  suspended: "text-[#FF8A80] border-[#FF6B6B33] bg-[#FF6B6B33]",
  invited: "text-[#D8E2FF] border-[#D8E2FF33] bg-[#D8E2FF1A]",
  inactive: "text-[#8A8D98] border-[#8A8D9833] bg-[#8A8D9833]",
};

export default function UserDetailsAside({
  selectedUser,
  onClose,
  onUserDeleted,
}) {
 

  if (!selectedUser) return null;

  
  return (
    <aside className="w-1/4 shrink-0 border-l border-[#2D303A] bg-[#191B23] h-screen flex flex-col text-[#E3E2E7] overflow-hidden">
      <div className="bg-[#0D0E11] border-b border-[#2D303A] p-5 flex justify-between items-center mb-5">
        <p className="text-lg font-semibold text-[#D8E2FF]">User Details</p>
        <AiOutlineClose
          className="text-xl text-[#C4C6D0] cursor-pointer"
          onClick={() => onClose}
        />
      </div>

      {/* profile */}
      <div className="p-7 flex-1 overflow-y-auto">
        <div className="flex items-center gap-3 mb-5">
          <img
            src={selectedUser.avatar || profilepic}
            alt="profile picture"
            className="w-15 h-15 object-cover rounded-md border border-[#D8E2FF1A]"
          />
          <div>
            <p className="font-semibold text-base">{selectedUser.fullName}</p>
            <p className="text-[#C4C6D0] text-xs my-0.5">
              {selectedUser.email}
            </p>
            <span
              className={`inline-flex items-center gap-1.5 text-xs rounded-full px-2 py-0.5 border mt-1 ${statusStyles[selectedUser.accountStatus] || ""}`}
            >
              <BsCircleFill className="w-1.5 h-1.5" />
              {selectedUser.accountStatus?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* organization */}
        <div className="mb-5 mt-7">
          <div className="flex items-center gap-2 text-xs text-[#C4C6D0] uppercase font-mono mb-3">
            <BsBuilding /> Organization
          </div>
          <div className="border-t border-[#2D303A] my-4"></div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#8A8D98] text-xs mb-1">ROLE</p>
              <p>{selectedUser.role || "—"}</p>
            </div>
            <div>
              <p className="text-[#8A8D98] text-xs mb-1">TEAM</p>
              <p>{selectedUser.team?.teamName || "—"}</p>
            </div>
            <div>
              <p className="text-[#8A8D98] text-xs mb-1">JOINED</p>
              <p>
                {selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-[#8A8D98] text-xs mb-1">REPORTS TO</p>
              <p>
                {selectedUser.reportsTo
                  ? `${selectedUser.reportsTo.firstName} ${selectedUser.reportsTo.lastName}`
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* projects & permissions - لسه مش موجودة في الباك */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-xs text-[#C4C6D0] uppercase font-mono mb-3">
            <HiOutlineFolder /> Projects &amp; Permissions
          </div>
          <div className="border-t border-[#2D303A] my-4"></div>

          <div className="flex flex-col gap-2">
            {projects.map((project, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-[#0D0E11] border border-[#2D303A] rounded-lg px-3 py-2.5 cursor-pointer hover:bg-[#20222C]"
              >
                <div className="flex items-center gap-3">
                  {project.icon === "terminal" ? (
                    <FiTerminal className="text-[#D8E2FF] text-xl" />
                  ) : (
                    <HiOutlineFolder className="text-[#D8E2FF] text-xl" />
                  )}
                  <div>
                    <p className="text-sm">{project.name}</p>
                    <p className="text-[#8A8D98] text-xs">{project.access}</p>
                  </div>
                </div>
                <HiChevronRight className="text-[#8A8D98]" />
              </div>
            ))}
          </div>
        </div>

        {/* workspace permissions - لسه مش موجودة في الباك */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-[#C4C6D0] uppercase font-mono mb-3">
            <MdOutlineSecurity /> Workspace Permissions
          </div>
          <div className="border-t border-[#2D303A] my-4"></div>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center">
              <p>Edit System Topology</p>
              <Toggle
                defaultChecked={selectedUser.permissions?.editTopology || false}
              />
            </div>
            <div className="flex justify-between items-center">
              <p>Manage Billing &amp; Subscriptions</p>
              <Toggle
                defaultChecked={
                  selectedUser.permissions?.manageBilling || false
                }
              />
            </div>
            <div className="flex justify-between items-center">
              <p>Access Security Audit Logs</p>
              <Toggle
                defaultChecked={
                  selectedUser.permissions?.accessAuditLogs || false
                }
              />
            </div>
          </div>
        </div>
      </div>

      <HandleButtons
        selectedUser={selectedUser}
        onClose={onClose}
        onUserDeleted={onUserDeleted}
      />
    </aside>
  );
}
