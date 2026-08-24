import profile_pic from "../../assets/profile-pic/profilePic.png";

import { FaHeadSideVirus } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { BsRocketTakeoff } from "react-icons/bs";

export default function RightSide() {
  const technologies = [
    { name: "React", color: "#D8E2FF" },
    { name: "Node.js", color: "#D8E2FF" },
    { name: "AWS", color: "#43D6A9" },
    { name: "Docker", color: "#43D6A9" },
    { name: "Kubernetes", color: "#43D6A9" },
    { name: "Redis", color: "#D8E2FF" },
    { name: "PostgreSQL", color: "#D8E2FF" },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* ================= Team Info ================= */}

      <div className="bg-[#1E1F23] p-6 border border-[#2D303A] rounded-lg">
        <h5 className="uppercase flex items-center gap-2 text-xs">
          <IoIosPeople className="text-lg" />
          Team Info
        </h5>

        {/* Parent Organization */}

        <div className="my-6">
          <div className="text-[11px] text-[#C4C6D0] pb-1">
            Parent Organization
          </div>

          <div className="font-semibold text-lg">
            Platform Engineering
          </div>
        </div>

        {/* Reports To */}

        <div className="my-6">
          <div className="text-[11px] text-[#C4C6D0] pb-1">
            Reports to
          </div>

          <div className="flex gap-3 items-center py-2">
            <img
              src={profile_pic}
              alt="Manager"
              className="w-8 h-8 border border-[#2D303A] rounded-full object-cover"
            />

            <span className="text-[#E3E2E7] font-semibold text-lg">
              Marcus Thorne{" "}
              <span className="text-[#C4C6D0] text-xs font-normal">
                (SVP Platform)
              </span>
            </span>
          </div>
        </div>

        {/* Workspace Access */}

        <div className="my-6">
          <div className="text-[11px] text-[#C4C6D0] pb-4">
            Workspace Access
          </div>

          <div className="text-[#E3E2E7] flex gap-3 flex-wrap">
            <span className="bg-[#121317] px-2 py-1 border border-[#2D303A] rounded-xs text-xs">
              Workspace Alpha
            </span>

            <span className="bg-[#121317] px-2 py-1 border border-[#2D303A] rounded-xs text-xs">
              Beta
            </span>

            <span className="bg-[#121317] px-2 py-1 border border-[#2D303A] rounded-xs text-xs">
              Core-Infra
            </span>
          </div>
        </div>
      </div>

      {/* ================= Current Projects ================= */}

      <div className="bg-[#1E1F23] p-7 border border-[#2D303A] rounded-lg">
        <h3 className="flex items-center gap-3 text-[#C4C6D0] text-[11px]">
          <BsRocketTakeoff />
          CURRENT PROJECTS
        </h3>

        <div className="flex flex-col gap-3.5">

          {/* Customer Platform */}

          <div className="inline-flex flex-col border-l-2 border-l-[#D8E2FF] pl-4 mt-4">
            <h2 className="font-semibold text-[#E3E2E7] text-lg">
              Customer Platform
            </h2>

            <p className="text-[#C4C6D0] text-lg">
              Role: Lead Architect
            </p>
          </div>

          {/* Inventory Modernization */}

          <div className="inline-flex flex-col border-l-2 border-l-[#2D303A] pl-4 mt-4">
            <h2 className="font-semibold text-[#E3E2E7] text-lg">
              Inventory Modernization
            </h2>

            <p className="text-[#C4C6D0] text-lg">
              Role: Technical Consultant
            </p>
          </div>

        </div>
      </div>

      {/* ================= Tech Stack ================= */}

      <div className="bg-[#1E1F23] p-6 border border-[#2D303A] rounded-lg">
        <h5 className="flex items-center text-sm gap-3 pb-5">
          <FaHeadSideVirus />
          TECH STACK EXPERTISE
        </h5>

        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <span
              key={tech.name}
              className="px-4 py-2 rounded-full bg-[#2A2C33] text-sm font-medium"
              style={{ color: tech.color }}
            >
              {tech.name}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}