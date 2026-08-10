import { BiRightArrowAlt } from "react-icons/bi"; 
import { MdOutlineCancel } from "react-icons/md"; 
import { BiArrowBack } from "react-icons/bi"; 
export default function WizardNavigation() {
  return (
    <>
        <nav className="flex items-center justify-between w-full p-4 px-6 bg-[#0A0B0D] border-t border-[#44474F60]">
            <div className="flex gap-2 items-center">
                <button className="flex gap-1 items-center bg-(--danger) text-(--dark-text) p-2 px-4 rounded-lg text-sm shadow-none hover:bg-(--danger)/90 hover:shadow-[0px_0px_7px_rgba(255,138,122,0.6)] transform ease-in-out duration-300">
                    <MdOutlineCancel className="text-lg"/>
                    Cancel
                </button>
            </div>
            <div className="flex items-center gap-10">
                <button className="flex gap-2 items-center text-sm">
                    <BiArrowBack />
                    Back
                </button>
                <button className="flex gap-2 items-center px-6 py-2 text-sm font-medium text-(--text-primary) bg-(--primary) rounded-lg shadow-none  hover:bg-(--primary)/90 hover:shadow-[0px_0px_7px_rgba(173,198,255,0.6)] transform ease-in-out duration-300 ">
                    Continue
                    <BiRightArrowAlt className="text-lg"/>
                </button>
            </div>
        </nav>
    </>
  )
}