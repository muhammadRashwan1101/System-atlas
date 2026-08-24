import profile_pic from "../../assets/profile-pic/profilePic.png";
import api, { SERVER_URL } from "../../api/axios";

import { useEffect, useState } from "react";
import { LuSquareChartGantt } from "react-icons/lu";
import { CiLocationOn } from "react-icons/ci";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";
import { FiMessageSquare } from "react-icons/fi";

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
        setError(
          err.response?.data?.msg || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <p className="text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-700">{error}</p>;
  }

  if (!user) {
    return null;
  }

  const avatarSrc = user.avatar
    ? `${SERVER_URL}${user.avatar}`
    : profile_pic;

  return (
    <div className="grid grid-cols-4 bg-[#1E1F23] border border-[#2D303A] rounded-lg p-12">

      {/* ================= User Information ================= */}

      <div className="col-span-3">
        <div className="grid grid-cols-5">

          {/* Profile Image */}

          <div className="col-span-1 relative">
            <img
              className="w-50 border-3 rounded-b-md border-(--tertiary) p-1 rounded-xl"
              src={avatarSrc}
              alt="Profile Picture"
            />

            <span className="absolute bottom-2 right-2 text-[#003824] bg-(--tertiary) px-4 py-1 font-semibold rounded-full text-sm">
              ACTIVE
            </span>
          </div>

          {/* User Details */}

          <div className="col-span-4 ml-6">

            {/* Name & Level */}

            <div className="mb-3 flex items-center">
              <span className="text-4xl tracking-wide text-white font-semibold mr-7">
                {user.fullName}
              </span>

              <span className="bg-[#343538] border border-[#424552] px-4 py-2 text-xl rounded">
                {user.level || "—"}
              </span>
            </div>

            {/* Job Title */}

            <p className="text-(--tertiary) text-xl font-semibold my-2">
              {user.jobTitle || "—"}
            </p>

            {/* Department & Location */}

            <div className="flex gap-3 text-lg my-4">
              <span className="flex justify-center items-center gap-2">
                <LuSquareChartGantt className="text-xl" />
                {user.department || "—"}
              </span>

              <span className="flex justify-center items-center gap-2">
                <CiLocationOn className="text-xl" />
                {user.location || "—"}
              </span>
            </div>

            {/* Workspaces */}

            <p className="flex items-center gap-2 text-lg">
              <IoEllipsisHorizontalCircle className="text-xl" />
              Workspace Alpha, Beta, Core-Infra
            </p>

            {/* Owned Components */}

            <p className="my-3">
              {stats?.ownedComponents ?? 0} Owned Components
            </p>

          </div>
        </div>
      </div>

      {/* ================= Actions ================= */}

      <div className="col-span-1 flex justify-center items-center">
        <div className="inline-flex flex-col gap-4 w-full m-5">

          {/* Message User */}

          <button
            type="button"
            className="flex items-center justify-center gap-2 text-[#003824] bg-(--tertiary) py-5 rounded w-full"
          >
            <FiMessageSquare />
            Message User
          </button>

          {/* View Team */}

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-[#343538] py-5 rounded"
          >
            <RiTeamFill />
            View Team
          </button>

        </div>
      </div>

    </div>
  );
}