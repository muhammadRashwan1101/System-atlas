import logo from "../../assets/system_atlas_logo.png"

import { NavLink } from "react-router-dom"
import { MdOutlineDashboard } from "react-icons/md";
import { PiGraph } from "react-icons/pi";
import { IoExtensionPuzzleSharp } from "react-icons/io5";
import { IoAnalyticsOutline } from "react-icons/io5";
import { PiStarFourFill } from "react-icons/pi";
import { FaFolderOpen } from "react-icons/fa6";
import { MdOutlineDomain } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";

export default function Sidebar() {
  return (
    <>
      <div className="flex flex-col items-center justify-between bg-(--main-bg) border-r border-(--border)/30 w-20 min-h-screen p-4">
        <div className="flex flex-col items-center justify-center w-full mb-5 space-y-4">
          <div className="flex flex-col items-center justify-center w-30 p-5">
            <img src={logo} alt="Logo" className="w-13 h-auto rounded-lg" />
          </div>
          <NavLink
            to="/dashboard"
            className="hover:bg-(--primary) hover:text-(--text-primary) p-3 rounded transition-all ease-in-out duration-250"
          >
            <MdOutlineDashboard className="w-5 h-5 (--text)" />
          </NavLink>
          <NavLink
            to="/graph"
            className="hover:bg-(--primary) hover:text-(--text-primary) p-3 rounded transition-all ease-in-out duration-250"
          >
            <PiGraph className="w-5 h-5 (--text)" />
          </NavLink>
          <NavLink
            to="/components"
            className="hover:bg-(--primary) hover:text-(--text-primary) p-3 rounded transition-all ease-in-out duration-250"
          >
            <IoExtensionPuzzleSharp className="w-5 h-5 (--text)" />
          </NavLink>
          <NavLink
            to="/analysis"
            className="hover:bg-(--primary) hover:text-(--text-primary) p-3 rounded transition-all ease-in-out duration-250"
          >
            <div className="w-5 h-5">
              <PiStarFourFill className="relative top-[13px] -right-[9.5px] scale-x-[-1] w-[7px] h-2 (--text) translate-y-[-13px] translate-x-[2px]" />
              <PiStarFourFill className="relative top-[8px] right-[1px] scale-x-[-1] w-[5px] h-2 (--text) translate-y-[-13px] translate-x-[2px]" />
              <IoAnalyticsOutline className="w-5 h-5 (--text) translate-y-[-13px] translate-x-[1px]" />
            </div>
          </NavLink>
          <NavLink
            to="/workspaces/workspaceId/new-project"
            className="hover:bg-(--primary) hover:text-(--text-primary) p-3 rounded transition-all ease-in-out duration-250"
          >
            <FaFolderOpen className="w-5 h-5 (--text)" />
          </NavLink>
          <NavLink
            to="/workspaces"
            className="hover:bg-(--primary) hover:text-(--text-primary) p-3 rounded transition-all ease-in-out duration-250"
          >
            <MdOutlineDomain className="w-5 h-5 (--text)" />
          </NavLink>
          <NavLink
            to="/teams"
            className="hover:bg-(--primary) hover:text-(--text-primary) p-3 rounded transition-all ease-in-out duration-250"
          >
            <HiUserGroup className="w-5 h-5 (--text)" />
          </NavLink>
        </div>
      </div>
    </>
  );
}
