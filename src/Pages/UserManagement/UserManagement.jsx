import { useState } from "react";

import { BiSend } from "react-icons/bi";
import { CgSoftwareUpload } from "react-icons/cg";

import { BsPersonPlus } from "react-icons/bs";
import { MdOutlinePeopleOutline } from "react-icons/md";

import { Link } from "react-router-dom";
import useUserStats from "../../hooks/useUserStats";
import useAllUsers from "../../hooks/useAllUsers";

import StatsCards from "../../components/UserManagment/StatsCards";
import UsersTable from "../../components/UserManagment/UsersTable";
import UserDetailsAside from "../../components/UserManagment/UserDetailsAside";

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { stats, loading: statsLoading } = useUserStats();
  const { users, loading: usersLoading, error: usersError ,refetch , updateUserLocally } = useAllUsers();
  
   const handleUserDeleted = () => {
    refetch();   };
const handleUserUpdated = (userId, updates) => {
  updateUserLocally(userId, updates);
};
  return (
    <div className="flex">
      <div className="flex-1 min-w-0">
        <nav className="w-full py-4 px-6 border-b border-[#2D303A]">
          <div className="flex justify-between items-center ">
            <div className="flex justify-center items-center  gap-2  font-bold text-[#D8E2FF]">
              <MdOutlinePeopleOutline className="text-2xl" />
              <p className="text-lg">User Management</p>
            </div>
            <div>
              <Link
                to="/modal"
                className="text-[#122F5F] bg-[#D8E2FF] rounded-md flex items-center gap-2 px-3 py-1.5 text-sm font-semibold"
              >
                <BsPersonPlus />
                <p>Invite User</p>
              </Link>
            </div>
          </div>
        </nav>
        <StatsCards stats={stats} loading={statsLoading} />
        <div className="mx-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-[#292A2D] text-[#C4C6D0] flex px-4 py-2 text-sm rounded-xl gap-6 cursor-pointer">
              <button>All</button>
              <button>Active</button>
              <button>Pending</button>
              <button>Suspended</button>
            </div>
            <div className="w-px bg-[#2D303A] h-8 mx-4 "></div>
            <div className="flex  gap-4 ">
              <div className="  bg-[#191B23] border border-[#2D303A] px-3 py-2 rounded-lg text-sm">
                Role:
                <select className="mx-2 cursor-pointer">
                  <option>Tech Lead</option>
                  <option>Any</option>
                  <option>Manager</option>
                </select>
              </div>
              <div className="  bg-[#191B23] border border-[#2D303A] px-3 py-2 rounded-lg text-sm">
                Team:
                <select className="mx-2 cursor-pointer">
                  <option>Front end</option>
                  <option>Back end</option>
                  <option>DevOps</option>
                </select>
              </div>
            </div>
          </div>
          <div className="text-[#E3E2E7] flex gap-3">
            <button className="bg-[#191B23] border border-[#2D303A] flex items-center gap-2 px-3 py-2 rounded-lg text-sm">
              <CgSoftwareUpload className="text-sm" /> Import CSV
            </button>
            <button className="bg-[#191B23] border border-[#2D303A] flex items-center gap-2 px-3 py-2 rounded-lg text-sm">
              <BiSend className="text-sm" />
              Bulk Invite
            </button>
          </div>
        </div>
        <UsersTable
          users={users}
          loading={usersLoading}
          error={usersError}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
        />
      </div>

      <UserDetailsAside
        selectedUser={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUserDeleted={handleUserDeleted}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}
