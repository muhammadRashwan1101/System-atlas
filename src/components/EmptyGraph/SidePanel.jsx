import { MdOutlineAnalytics } from "react-icons/md"; 
export default function SidePanel() {
  return (
    <div id="sidePanel" className="flex flex-col gap-5 w-1/5 h-full bg-[#131519] border-l border-(--border)/20 shadow-[2px_0px_7px_rgba(0,0,0,0.5)] p-6">
      <div className="flex flex-col gap-5 p-4 shadow-[4px_4px_8px_rgba(8,10,14,1),-2px_-2px_6px_rgba(30,33,41,1)] rounded-2xl font-light">
        <h3 className="font-(family-name:--labels) text-[#C4C6D0]/60 text-sm">Project Summary</h3>
        <div className="flex items-center justify-between">
          <h3>Components</h3>
          <h3>0</h3>
        </div>
        <div className="flex items-center justify-between">
          <h3>Relationships</h3>
          <h3>0</h3>
        </div>
        <div className="flex items-center justify-between">
          <h3>Teams</h3>
          <h3>0</h3>
        </div>
        <div className="flex flex-col gap-3 ">
          <div className="flex justify-between font-normal font-(family-name:--labels) uppercase text-(--danger) text-xs"> 
            <h3>Risk Level</h3>
            <h3>Critical</h3>
          </div>
            <progress value={0} max={100} className=" h-1.5 w-full"/>
        </div>
      </div>
      <div className="flex flex-col gap-3 items-center justify-center text-center h-full bg-[#0B0E15] rounded-xl shadow-[inset_4px_4px_8px_rgba(5,6,8,1),inset_-2px_-2px_6px_rgba(21,24,31,1)]">
        <MdOutlineAnalytics className="text-[#44474F]/40 text-[40px]"/>
        <p className="text-sm max-w-[32ch] font-(family-name:--labels) text-(--text)/50">
          Initialize architecture to begin monitoring system health & latency
        </p>
      </div>                  
    </div>
  )
}
