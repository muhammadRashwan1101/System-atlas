import { AiOutlinePlusCircle } from "react-icons/ai"; 
import { AiOutlineQuestionCircle } from "react-icons/ai"; 
import { AiOutlineBell } from "react-icons/ai"; 
export default function WizardHeader() {
  return (
    <>
        <nav className="flex items-center justify-between w-full p-4 bg-[#0A0B0D] border-b border-[#44474F60]">
            <div className="flex gap-2 items-center">
                <AiOutlinePlusCircle className="text-xl"/>
                <h2>Step 1 of 5: Basic Component Information</h2>
            </div>
            <div className="flex items-center gap-4">
                <AiOutlineBell className="text-xl"/>
                <AiOutlineQuestionCircle className="text-xl"/>
            </div>
        </nav>
    </>
  )
}
