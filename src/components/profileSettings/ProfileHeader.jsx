import { MdOutlineModeEdit } from "react-icons/md";
import { CgSoftwareUpload } from "react-icons/cg";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { RiOrganizationChart } from "react-icons/ri";
import { BiCheckShield } from "react-icons/bi";
import profile_pic from "../../assets/profile-pic/AB6AXuARfjphqxLOVfKIAwziXLGL99vQMTf5DMhPlWgDCjB5g2IOOGogl31sHtNpFVanKVxwam-Onwpqed3ThMhwb02hxs1waLCvxZnx1JyxOydNr2Gs9HlCwNyRI_lL9wyS4fGBx3OO9V-NsLUyBUv91hCjEdlPiJsTE8kJaedu-40uFTQyX__e1ub5k7b1-di93wS7uABKSm4fGyPUjc.png";
import { AiOutlineCamera } from "react-icons/ai";
export default function ProfileHeader() {
  return (
    <>
      <div className="bg-[#1E1F23] border border-[#2D303A] rounded-2xl py-10 px-13 grid grid-cols-10">
        <div className="col-span-1 relative">
          <img
            src={profile_pic}
            alt="Profile Picture"
            className="w-45 border-2 border-[#D8E2FF4D] p-2 rounded-2xl"
          />
          <AiOutlineCamera className=" absolute -bottom-1.5 -right-3.5 text-[#122F5F] bg-[#D8E2FF]  text-4xl p-2 rounded-xl " />
        </div>
        <div className="col-span-7 flex justify-center gap-2.5 flex-col px-8">
          <div className="flex gap-4 items-center ">
            <h1 className="text-4xl capitalize text-[#D8E2FF] font-medium">
              shahd khairy
            </h1>
            <span className="text-[#C4C6D0] bg-[#343538] border border-[#424552]  rounded-sm py-0.5 px-1.5">
              ID: SCH-992-ARC
            </span>
          </div>
          <div className="flex gap-5">
            <div className=" flex items-center  gap-2">
              <BiCheckShield className="text-xl text-[#D8E2FF]" />
              <span className="text-[#C4C6D0] text-lg">Lead Architect</span>
            </div>
            <div className=" flex items-center  gap-2">
              <RiOrganizationChart className="text-xl text-[#4EDEA3]" />
              <span className="text-[#C4C6D0] text-lg">Platform SRE</span>
            </div>
            <div className=" flex items-center  gap-2">
              <AiOutlineFolderOpen className="text-xl text-[#FFB786]" />
              <span className="text-[#C4C6D0] text-lg">12 Workspaces</span>
            </div>
          </div>
        </div>
        <div className="col-span-2 gap-4 flex flex-col font-semibold justify-center items-end">
          <button className="w-50 flex items-center justify-center py-4 bg-[#ADC6FF] text-[#385283] rounded-lg">
            <MdOutlineModeEdit className="text-xl mr-2" />
            Edit Profile
          </button>
          <button className="w-50 flex items-center justify-center py-4 bg-[#343538] text-[#E3E2E7] rounded-lg">
            <CgSoftwareUpload className="text-xl mr-2" />
            Upload Avatar
          </button>
        </div>
      </div>
    </>
  );
}
