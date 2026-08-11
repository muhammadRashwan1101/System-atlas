import { BiDotsVerticalRounded } from "react-icons/bi";
import { BsCircleFill } from "react-icons/bs";
import profilepic from "../../assets/profile-pic/profliePic.png";
import timeAgo from "../../Utils/timeAgo";

const statusStyles = {
  active: "text-[#4EDEA3] border-[#4EDEA333] bg-[#4EDEA333]",
  pending: "text-[#D8E2FF] border-[#D8E2FF33] bg-[#D8E2FF1A]",
  suspended: "text-[#FF8A80] border-[#FF6B6B33] bg-[#FF6B6B33]",
  invited: "text-[#D8E2FF] border-[#D8E2FF33] bg-[#D8E2FF1A]",
  inactive: "text-[#8A8D98] border-[#8A8D9833] bg-[#8A8D9833]",
};

export default function UsersTable({
  users,
  loading,
  error,
  selectedUser,
  onSelectUser,
}) {
  return (
    <>
      <div className="mx-6 my-6 border border-[#2D303A] rounded-2xl bg-[#0D0E11] py-3">
        <table className="w-full table-fixed">
          <thead>
            <tr className="text-sm text-[#C4C6D0] font-mono border-b border-[#2D303A]">
              <th className="pb-2 text-left px-3 w-[25%]">USER</th>
              <th className="pb-2 text-left px-3 w-[15%]">ROLE</th>
              <th className="pb-2 text-left px-3 w-[20%]">TEAM</th>
              <th className="pb-2 text-left px-3 w-[20%]">STATUS</th>
              <th className="pb-2 text-left px-3 w-[10%]">LAST ACTIVE</th>
              <th className="pb-2 w-[10%]"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-[#C4C6D0]">
                  Loading...
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-[#FF8A80]">
                  {error}
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              users.map((user) => (
                <tr
                  key={user._id}
                  onClick={() => onSelectUser(user)}
                  className={`bg-[#191B23] border-b border-[#2D303A] cursor-pointer hover:bg-[#20222C] transition-colors duration-150 ${
                    selectedUser?._id === user._id ? "bg-[#20222C]" : ""
                  }`}
                >
                  <td className="p-3 flex gap-3 items-center">
                    <img
                      src={user.avatar || profilepic}
                      alt="profile picture"
                      className="w-8 h-8 object-cover border border-[#D8E2FF1A] rounded-md"
                    />
                    <div>
                      <div className="text-[#E3E2E7] font-mono text-sm">
                        {user.fullName}
                      </div>
                      <div className="text-[#C4C6D0] text-xs">{user.email}</div>
                    </div>
                  </td>

                  <td className="px-3 align-middle">
                    <span className="bg-[#2D303A] text-[#C4C6D0] text-xs font-mono px-2 py-1 rounded">
                      {user.role || "—"}
                    </span>
                  </td>

                  <td className="px-3 align-middle text-[#C4C6D0] text-sm">
                    {user.team?.teamName || "—"}
                  </td>

                  <td className="px-3 align-middle">
                    <span
                      className={`w-fit flex items-center gap-1.5 text-xs rounded-full px-2 py-0.5 border ${statusStyles[user.accountStatus]}`}
                    >
                      <BsCircleFill className="w-1.5 h-1.5" />
                      {user.accountStatus}
                    </span>
                  </td>

                  <td className="px-3 align-middle text-[#C4C6D0] text-xs">
                    {timeAgo(user.lastActive)}
                  </td>

                  <td
                    className="px-3 align-middle text-[#C4C6D0]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BiDotsVerticalRounded className="cursor-pointer" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex justify-between px-5 pt-3">
          <div className="text-[#C4C6D0] font-mono text-sm flex items-center">
            Showing 1-10 of 1,284 users
          </div>
          <div className="flex gap-3">
            <button className="text-[#C4C6D0] border border-[#2D303A] bg-[#191B23] px-3 py-1.5 text-sm rounded">
              Previous
            </button>
            <button className="text-[#C4C6D0] border border-[#2D303A] bg-[#191B23] px-3 py-1.5 text-sm rounded">
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
