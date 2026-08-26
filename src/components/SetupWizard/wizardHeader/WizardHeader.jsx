import { AiOutlineQuestionCircle, AiOutlineBell } from "react-icons/ai";
import Breadcrumbs from "../../Navigation/Breadcrumbs";

export default function WizardHeader() {
  return (
    <nav className="flex items-center justify-between w-full px-6 py-3 bg-[#0A0B0D] border-b border-[#232730]">
      <div className="flex gap-2 items-center">
        <Breadcrumbs />
      </div>
      <div className="flex items-center gap-4 text-slate-400">
        <button type="button" aria-label="Notifications" className="hover:text-white transition-colors cursor-pointer">
          <AiOutlineBell className="text-xl" />
        </button>
        <button type="button" aria-label="Help" className="hover:text-white transition-colors cursor-pointer">
          <AiOutlineQuestionCircle className="text-xl" />
        </button>
      </div>
    </nav>
  );
}
