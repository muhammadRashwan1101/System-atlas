import { IoExtensionPuzzleOutline } from "react-icons/io5";
import { MdOutlineDomain } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";
import { PiTreeViewFill } from "react-icons/pi";
import { IoMdFolderOpen } from "react-icons/io";
import { PiTreeStructure } from "react-icons/pi";
import { FaRegUser } from "react-icons/fa";

export default function TopologyPreview() {
  return (
    <div className="flex flex-col w-1/2 h-full p-8 shadow-[-2px_-4px_7px_rgba(0,0,0,0.6)] border-[#44474F30]">
      <div className="flex items-center justify-between w-full py-8">
        <h2 className="font-(family-name:--labels) uppercase text-(--primary)">
          Workspace Structure
        </h2>
        <PiTreeViewFill className="w-6 h-6 text-(--primary)" />
      </div>
      <div className="flex flex-col justify-between w-full h-2/3 p-8 bg-[#1E1F23] rounded-lg shadow-[inset_2px_2px_7px_0px_rgba(145,150,161,0.2),inset_-2px_-2px_7px_rgba(0,0,0,0.6)]">
        <div className="flex flex-col gap-8 w-full h-full p-3 rounded-lg">
          <div className="flex items-center gap-4">
            <MdOutlineDomain className="w-5 h-5 text-(--primary)" />
            <h3 className="font-(family-name:--labels) text-(--text) text-sm uppercase">
              New Workspace
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-3 border-s border-b "></div>
            <IoMdFolderOpen className="w-5 h-5 mt-2 text-(--text)" />
            <p className="font-(family-name:--labels) text-(--text) text-sm mt-2">
              Projects
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-13 h-3 "></div>
            <div className="w-10 h-3 border-s border-b "></div>
            <IoExtensionPuzzleOutline className="w-5 h-5 mt-2 text-(--text)" />
            <p className="font-(family-name:--labels) text-(--text) text-sm mt-2">
              Components
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-13 h-3 "></div>
            <div className="w-10 h-3 border-s border-b "></div>
            <PiTreeStructure className="w-5 h-5 mt-2 text-(--text)" />
            <p className="font-(family-name:--labels) text-(--text) text-sm mt-2">
              Reltionships
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-3 border-s border-b "></div>
            <HiOutlineUserGroup className="w-5 h-5 mt-2 text-(--text)" />
            <p className="font-(family-name:--labels) text-(--text) text-sm mt-2">
              Teams
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-13 h-3 "></div>
            <div className="w-10 h-3 border-s border-b "></div>
            <FaRegUser className="w-4 h-4 mt-2 text-(--text)" />
            <p className="font-(family-name:--labels) text-(--text) text-sm mt-2">
              Members
            </p>
          </div>
        </div>
        <div className="border-t border-[#44474F30] mt-8 pt-4">
          <p className="font-(family-name:--labels) text-(--border)">
            This organizational structure will be populated after workspace
            creation.
          </p>
        </div>
      </div>
      <div></div>
    </div>
  );
}
