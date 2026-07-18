import { AiOutlineImport } from "react-icons/ai"; 
import { CgAddR } from "react-icons/cg"; 
import { MdOutlineRouter } from "react-icons/md"; 
import { GrStorage } from "react-icons/gr"; 
import { AiOutlineCloud } from "react-icons/ai"; 
import { BiShieldQuarter } from "react-icons/bi"; 
import { MdHub } from "react-icons/md"; 
import styles from "./graph.module.css"
import { Link } from "react-router-dom";
export default function GraphSection() {
  return (
   <div id="graph" className="flex flex-col gap-20 items-center justify-center w-4/5 h-full">
        <div id="centerComp" className="absolute top-62 w-1/5 h-1/3 bg-[#D8E2FF]/15 blur-[80px] -z-10"></div>
        <div className=" flex relative items-center justify-center">
            <div className="relative w-72 h-72">
                <div className={`absolute top-1/2 left-1/3 -tanslate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 w-25 h-25 bg-[#191B23] rounded-2xl shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_0px_6px_rgba(50,56,66,1)]`}>
                    <MdHub className="text-[40px] text-center text-[#D8E2FF]"/>
                </div>
                <div className={`${styles.graphObj1} absolute top-47 left-15 -tanslate-x-1/2 -translate-y-1/2 flex items-center justify-center z-9 w-13 h-13 bg-[#191B23] rounded-xl shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_0px_6px_rgba(50,56,66,0.6)]`}>
                    <BiShieldQuarter className="text-xl text-center text-(--primary)"/>
                </div>
                <div className={`${styles.graphObj2} absolute top-50 right-10 -tanslate-x-1/2 -translate-y-1/2 flex items-center justify-center z-8 w-16 h-16 bg-[#191B23] rounded-2xl shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_-2px_6px_rgba(36,40,49,1)]`}>
                    <AiOutlineCloud className="text-2xl text-center text-[#FFB786]"/>
                </div>
                <div className={`${styles.graphObj3} absolute top-18 left-15 -tanslate-x-1/2 -translate-y-1/2 flex items-center justify-center z-7 w-11 h-11 bg-[#191B23] rounded-lg shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_-2px_6px_rgba(36,40,49,1)]`}>
                    <GrStorage className="text-lg text-center text-[#4EDEA3]"/>
                </div>
                <div className={`${styles.graphObj4} absolute top-23 right-10 -tanslate-x-1/2 -translate-y-1/2 flex items-center justify-center z-6 w-10 h-10 bg-[#191B23]/40 rounded-lg shadow-[4px_4px_8px_rgba(8,10,14,0.5),-2px_-2px_6px_rgba(36,40,49,1)]`}>
                    <MdOutlineRouter className="text-xl text-center text-(--text)/40"/>
                </div>
            </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-10 text-center">
            <h3 className="text-4xl text-[#E3E2E7]">Your architecture starts here.</h3>
            <p className="text-md leading-7 max-w-[45ch] font-light ">Begin mapping your system's infrastructure to unlock real-time telemetry visualization, automated impact analysis, and workspace-wide tracing.</p>
            <div className="flex gap-3">
                <Link to="/new-component" id={styles.addComp} className="bg-(--primary) text-(--text-primary) p-5 rounded-xl text-sm flex items-center gap-2 max-w-[25ch] hover:bg-[#ccdaff] transition-all ease-in-out duration-200">
                    <CgAddR className="text-3xl"/>
                    Add the First Component
                </Link>
                <Link to="/archeticture" className="bg-transparent border border-(--border) p-5 rounded-xl text-sm flex items-center max-w-[25ch] hover:bg-(--border)/30 hover:text-white transition-all ease-in-out duration-200">
                    <AiOutlineImport className="text-3xl"/>
                    Import existing Archeticture
                </Link>
            </div>
        </div>
    </div>
  )
}
