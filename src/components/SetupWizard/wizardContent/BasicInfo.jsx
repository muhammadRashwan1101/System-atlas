import { AiOutlineFileText } from "react-icons/ai"; 
import { RxGear } from "react-icons/rx"; 
import { GiHamburgerMenu } from "react-icons/gi"; 
import { AiOutlineCloud } from "react-icons/ai"; 
import { BsDatabase } from "react-icons/bs"; 
import { MdOutlineSettingsInputComposite } from "react-icons/md"; 
import { CgScreen } from "react-icons/cg"; 
import { MdOutlineHub } from "react-icons/md"; 
import { BiTag } from "react-icons/bi"; 

const Types = [
  {
    id: "API-Gateway",
    type: "API-Gateway",
    value: "api-gateway",
    icon: <MdOutlineHub />
  },
  {
    id: "Frontend",
    type: "Frontend",
    value: "frontend",
    icon: <CgScreen />
  },
  {
    id: "Backend",
    type: "Backend",
    value: "backend",
    icon: <MdOutlineSettingsInputComposite />
  },
  {
    id: "Database",
    type: "Database",
    value: "database",
    icon: <BsDatabase />
  },
  {
    id: "Queue",
    type: "Queue",
    value: "queue",
    icon: <GiHamburgerMenu />
  },
  {
    id: "Cloud Service",
    type: "Cloud Service",
    value: "cloud-service",
    icon: <AiOutlineCloud />
  },

]

export default function BasicInfo() {
  return (
    <div className="bg-[#131519] rounded-xl p-5 w-full">
      <form className="flex flex-col gap-5 p-4 w-full">
        <div className="flex flex-col gap-3">
          <h2 className="font-(family-name: --headers) font-semibold">Basic Component Information</h2>
          <h3 className="text-xs max-w-[50ch] font-light">Define the fundamental identity and classification of your new architectural node within the System Atlas graph.</h3>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">

           <label
              htmlFor="componentName"
              className="flex gap-1 items-center text-(--text)/60 font-(family-name:--labels) uppercase text-xs"
              >
              <BiTag className="rotate-y-180 text-lg"/>
              Component Name
            </label>
          <input
              type="text"
              id="componentName"
              name="componentName"
              placeholder="e.g. Authentication-Service"
              className="p-3 rounded-lg bg-[#0D0E11] text-(--text) shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:shadow-[-2px_-2px_4px_rgba(255,255,255,0.05),2px_2px_4px_rgba(0,0,0,0.6)] transition-all ease-in-out duration-200 "
              />
            <p className="text-xs italic text-(--text)/50 font-light">Naming should follow kebab-case or PascalCase conventions.</p>
          </div>
            <span className="flex gap-1 items-center text-(--text)/60 font-(family-name:--labels) uppercase text-xs">
              <RxGear className="text-lg"/>
              Component Type
            </span>
            <div className="grid grid-cols-2 gap-4">
              {Types.map((type) => {
                return (
                  <button
                    key={type.id}
                    type="button"
                    className={`p-3.5 rounded-lg border font-(--headings) text-sm transition-all duration-150 transform active:scale-95 flex items-center gap-3 cursor-pointer`}
                  >
                    <div
                      className={`p-2 rounded-md transition-colors text-xl`}
                    >
                    {type.icon}
                    </div>

                    <span>{type.type}</span>
                  </button>
                );
              })}
            </div>
            <label
              htmlFor="workspaceDescription"
              className="flex gap-1 items-center text-(--text)/60 font-(family-name:--labels) uppercase text-xs"
            >
              <AiOutlineFileText className="text-lg"/>
              Description
            </label>
            <textarea
              id="workspaceDescription"
              name="description"
              placeholder="Briefly describe the purpose and ownership of this component..."
              className=" resize-none p-3 rounded-lg bg-[#0D0E11] text-(--text) border-0 border-(--border) shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:shadow-[-2px_-2px_4px_rgba(255,255,255,0.05),2px_2px_4px_rgba(0,0,0,0.6)] transition-all ease-in-out duration-200 "
              rows={4}
            ></textarea>
        </div>
      </form>
    </div>
  )
}
