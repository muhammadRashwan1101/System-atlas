import profile_pic from "../../assets/profile-pic/profliePic.png";
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
      <div className="bg-[#1E1F23] border border-[#2D303A] rounded-lg p-12 ">
        <div className="grid grid-cols-8 ">
          <div className=" col-1 relative">
            <img
              className="w-50 border-3 rounded-b-md border-(--tertiary)  p-1 rounded-xl"
              src= {avatarSrc}
              alt="Profile Picture"
            />
            <span className="absolute bottom-0 right-0 text-[#003824] bg-(--tertiary) px-4 py-1 font-semibold rounded-full text-sm">
              ACTIVE
            </span>
          </div>

          <div className="col-span-4 ml-6">
            <div className="mb-3 flex ">
              <span className="text-4xl tracking-wide text-white font-semibold mr-7">
                {user.fullName}
              </span>
              <span className="bg-[#343538] border-rounded px-4 py-2 text-xl">
                {user.level}
              </span>{" "}
            </div>
            <p className="text-(--tertiary)) text-xl font-semibold my-2">
              {user.jobTitle}
            </p>
            <div className="flex  gap-3 text-lg my-4">
              <span className="flex justify-center items-center gap-2">
                <LuSquareChartGantt className="text-xl" />
                {user.department}
              </span>
              <span className="flex justify-center items-center gap-2">
                <CiLocationOn className="text-xl" />
                {user.location}
              </span>
            </div>
            <p className="flex  items-center gap-2 text-lg">
              {" "}
              <IoEllipsisHorizontalCircle className="text-xl" /> Workspace
              Alpha, Beta, Core-Infra
            </p>
            <p className="my-3">{stats.ownedComponents} Owned Components</p>
          </div>
          <div className="col-span-2 flex justify-center items-center">
            <div className="inline-flex flex-col gap-4 w-55">
              <button className="flex items-center justify-center gap-2 text-[#003824] bg-(--tertiary) p-4 rounded">
                <FiMessageSquare />
                Message User
              </button>

              <button className="w-full flex items-center justify-center gap-2 bg-[#343538] p-4 rounded">
                <RiTeamFill />
                View Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
