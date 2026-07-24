import { RxMagnifyingGlass } from "react-icons/rx"; 
import { AiOutlineBell } from "react-icons/ai"; 
import GraphSection from "../../components/EmptyGraph/GraphSection"
import SidePanel from "../../components/EmptyGraph/SidePanel"
import { Link } from "react-router-dom"

export default function EmptyGraph() {
  return (
    <div className="flex flex-col w-full h-screen">
        <nav className="flex items-center justify-between w-full h-1/15 p-7 bg-[#0A0B0D] shadow-[0px_2px_7px_rgba(8,8,10,0.8)]">
            <div className="flex items-center gap-2">
                <Link to="/project/:projectId"><h3 className="font-(family-name:--labels) text-sm text-(--text)/40 hover:text-white transition-all duration-150 ease-in-out">projectName</h3></Link>
                <h3 className="font-(family-name:--labels) text-sm text-(--text)/40">/</h3>
                <h3 className="font-(family-name:--labels) text-sm text-(--primary)">GraphName</h3>
            </div>
        <div className="flex items-center gap-5">
            <RxMagnifyingGlass  className="absolute translate-x-3  focus:outline-none"/>
            <input type="text" name="search" id="search" placeholder="Search for services..." className="relative border border-[#44474F]/30 ps-9 pe-20 py-2 rounded-xl text-sm focus:outline-none font-(family-name:--labels)"/>
            <AiOutlineBell className="text-2xl text-center hover:text-white cursor-pointer"/>
        </div>
        </nav>
        <div className="flex w-full h-full">
            <GraphSection />
            <SidePanel />
        </div>
    </div>
  )
}
