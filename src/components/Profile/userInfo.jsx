import profile_pic from "../../assets/profile-pic//profliePic.png";
import api from "../../api/axios";
import { useEffect, useState } from "react";
import { LuSquareChartGantt } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";
import { FiMessageSquare } from "react-icons/fi";
import { SERVER_URL } from "../../api/axios";
export default function UserInfo() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMyProfile = async () => {
    const res = await api.get("/profile/me");
    return res.data;
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user, stats } = await getMyProfile();
        setUser(user);
        setStats(stats);
      } catch (err) {
        setError(err.response?.data?.msg || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-700">{error}</p>;
  const avatarSrc = user.avatar ? `${SERVER_URL}${user.avatar}` : profile_pic;
  return (
    <>
    <div className="grid grid-cols-4 bg-[#1E1F23] border border-[#2D303A] rounded-lg p-12">
<div className= "col-span-3  ">
        <div className="grid grid-cols-5 ">
          <div className="col-span-1 relative">
            <img
              className="w-50 border-2 rounded-2xl border-(--primary)/40 p-1 bg-[#121418]"
              src={avatarSrc}
              alt="Profile Picture"
            />
            <span className="absolute bottom-2 right-2 text-[#002E6A] bg-(--primary) px-3 py-0.5 font-bold rounded-full text-xs font-mono shadow-[0_0_8px_rgba(173,198,255,0.6)]">
              ACTIVE
            </span>
          </div>

          <div className="col-span-4 ml-6">
            <div className="mb-3 flex items-center">
              <span className="text-3xl tracking-wide text-white font-bold mr-4">
                {user.fullName}
              </span>
              <span className="bg-[#121418] border border-[#2B3240] text-slate-300 font-mono rounded px-3 py-1 text-xs">
                {user.level}
              </span>{" "}
            </div>
            <p className="text-(--primary) text-lg font-medium my-1">
              {user.jobTitle}
            </p>
            <div className="flex gap-4 text-sm text-slate-300 my-3">
              <span className="flex justify-center items-center gap-1.5 font-mono text-xs">
                <LuSquareChartGantt className="text-base text-(--primary)" />
                {user.department}
              </span>
              <span className="flex justify-center items-center gap-1.5 font-mono text-xs">
                <CiLocationOn className="text-base text-[#4EDEA3]" />
                {user.location}
              </span>
            </div>
            <p className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <IoEllipsisHorizontalCircle className="text-sm text-(--primary)" /> Workspace
              Alpha, Beta, Core-Infra
            </p>
            <p className="my-3 text-xs font-mono text-slate-400">{stats?.ownedComponents || 0} Owned Components</p>
          </div>
          
        </div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="inline-flex flex-col gap-3 w-full m-5 font-mono text-xs">
          <button className="flex items-center justify-center gap-2 text-(--text-primary) bg-(--primary) hover:bg-[#ccdaff] font-semibold py-3.5 rounded-lg w-full transition-all shadow-[0_0_12px_rgba(173,198,255,0.25)] cursor-pointer">
            <FiMessageSquare />
            Message User
          </button>

          <button className="w-full flex items-center justify-center gap-2 bg-[#121418] hover:bg-[#1A1F2C] border border-[#2B3240] text-slate-200 py-3.5 rounded-lg transition-colors cursor-pointer">
            <RiTeamFill />
            View Team
          </button>
        </div>
      </div>
    </div>
      
    </>
  );
}
