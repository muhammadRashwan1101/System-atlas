import { BsPeople, BsBroadcast, BsCircleFill } from "react-icons/bs";
import { AiOutlineMail } from "react-icons/ai";
import { MdOutlineGroups2 } from "react-icons/md";

export default function StatsCards({ stats, loading }) {
  return (
    <>
      <div className="m-6 grid grid-cols-4 gap-5">
        <div className="bg-[#191B23] border border-[#2D303A] rounded-xl p-4 hover:shadow-[0_0_20px_#4EDEA31A] transition-all duration-300">
          <div className="flex justify-between items-center">
            <p className="uppercase text-sm text-[#C4C6D0] leading-5">
              total users
            </p>
            <BsPeople className="text-xl text-[#D8E2FF] opacity-50" />
          </div>

          <p className="text-3xl text-[#E3E2E7] my-3">
            {" "}
            {loading ? "…" : stats?.totalUsers?.toLocaleString()}
          </p>
          <p className="text-[#4EDEA3] text-sm">+12% vs last month</p>
        </div>

        <div className="bg-[#191B23] border border-[#2D303A] rounded-xl p-4 hover:shadow-[0_0_20px_#4EDEA31A] transition-all duration-300">
          <div className="flex justify-between items-center">
            <p className="uppercase text-sm text-[#C4C6D0] leading-5">
              PENDING
            </p>
            <AiOutlineMail className="text-xl text-[#FEB685] opacity-50" />
          </div>

          <p className="text-3xl text-[#E3E2E7] my-3">
            {loading ? "…" : stats?.pending}
          </p>
          <p className="text-[#C4C6D0] text-sm">Awaiting verification</p>
        </div>
        <div className="bg-[#191B23] border border-[#2D303A] rounded-xl p-4 hover:shadow-[0_0_20px_#4EDEA31A] transition-all duration-300">
          <div className="flex justify-between items-center">
            <p className="uppercase text-sm text-[#C4C6D0] leading-5">TEAMS</p>
            <MdOutlineGroups2 className="text-2xl text-[#4EDEA3] opacity-50" />
          </div>

          <p className="text-3xl text-[#E3E2E7] my-3">
            {loading ? "…" : stats?.teams}
          </p>
          <p className="text-[#C4C6D0] text-sm">Across 4 departments</p>
        </div>
        <div className="bg-[#191B23] border border-[#2D303A] rounded-xl p-4 hover:shadow-[0_0_20px_#4EDEA31A] transition-all duration-300">
          <div className="flex justify-between items-center">
            <p className="uppercase text-sm text-[#C4C6D0] leading-5">
              ACTIVE USERS
            </p>
            <BsBroadcast className="text-2xl text-[#4EDEA3] opacity-80" />
          </div>

          <p className="text-3xl text-[#E3E2E7] my-3">
            {" "}
            {loading ? "…" : stats?.activeUsers}
          </p>
          <p className="text-[#4EDEA3] text-sm flex items-center gap-2">
            <BsCircleFill className="text-xs" /> Live Now
          </p>
        </div>
      </div>
    </>
  );
}
