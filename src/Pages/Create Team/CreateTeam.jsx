import { useState, useRef } from "react";
import { RxMagnifyingGlass } from "react-icons/rx";
import { AiOutlineBell } from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import api from "../../api/axios";

import TeamForm from "../../components/CreateTeam/TeamForm";
import CategorySection from "../../components/CreateTeam/CategorySection";
import TeamLeadSelect from "../../components/CreateTeam/TeamLeadSelect";
import EntityPreview from "../../components/CreateTeam/EntityPreview";

export default function CreateTeam() {
  const formRef = useRef();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    teamName: "",
    teamCode: "",
    description: "",
    category: "",
    teamLead: null,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategorySelect = (categoryLabel) => {
    setFormData((prev) => ({ ...prev, category: categoryLabel }));
  };

  const handleTeamLeadSelect = (leadObj) => {
    setFormData((prev) => ({ ...prev, teamLead: leadObj }));
  };

  const handleFooterSubmit = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleFinalSubmit = async (basicFormData) => {
    if (isSubmitting) return; // منع التكرار إذا كان زر الإرسال نشطاً

    if (!formData.category) {
      toast.error("Please select a team category");
      return;
    }

    // مرونة في قراءة معرف القائد سواء كان كائناً أو معرفاً مباشراً
    const leadId =
      formData.teamLead?._id ||
      formData.teamLead?.id ||
      (typeof formData.teamLead === "string" ? formData.teamLead : null);

    if (!leadId) {
      toast.error("Please assign a valid team lead");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      teamName: basicFormData.teamName.trim(),
      teamCode: basicFormData.teamCode.trim().toUpperCase(),
      description: basicFormData.description.trim(),
      category: formData.category,
      teamLead: leadId,
      responsibilities: [],
      members: [],
      status: "active",
    };

    try {
      const response = await api.post("/teams", payload);

      if (response.status === 201 || response.status === 200) {
        toast.success("Team created successfully!");
        navigate("/teams"); 
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (Array.isArray(err.response?.data?.details)
          ? err.response?.data?.details[0]?.message
          : "Failed to create team. Check all inputs.");

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLeaderFullName = () => {
    if (!formData.teamLead) return "Unassigned";
    if (typeof formData.teamLead === "string") return formData.teamLead;
    const name = `${formData.teamLead.firstName || ""} ${formData.teamLead.lastName || ""}`.trim();
    return name || formData.teamLead.name || formData.teamLead.username || "Unassigned";
  };

  return (
    <div className="flex flex-col w-full h-screen bg-[#060709] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between w-full h-16 px-8 bg-[#0A0B0D] border-b border-slate-800/60 shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <h3 className="font-mono text-xs tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer uppercase">
            System Atlas
          </h3>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-xs tracking-wider text-slate-500 uppercase">
            Governance • Team Creation
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative flex items-center">
            <RxMagnifyingGlass className="absolute left-3 text-slate-500 text-base" />
            <input
              type="text"
              placeholder="Search architecture resources..."
              className="bg-[#0d0f14] border border-slate-800 pl-9 pr-12 py-1.5 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 font-mono w-72"
            />
          </div>
          <AiOutlineBell className="text-xl text-slate-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 w-full overflow-y-auto p-8 bg-[#060709]">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
            <TeamForm
              formRef={formRef}
              onInputChange={handleInputChange}
              onFinalSubmit={handleFinalSubmit} 
            />
            <CategorySection
              selectedCategory={formData.category}
              onSelectCategory={handleCategorySelect}
            />
            <TeamLeadSelect
              value={formData.teamLead}
              onChange={handleTeamLeadSelect}
            />
          </div>

          {/* Right Column: Live Preview */}
          <div className="col-span-12 lg:col-span-4 sticky top-0">
            <EntityPreview
              teamName={formData.teamName}
              teamCode={formData.teamCode}
              leaderName={getLeaderFullName()}
            />
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between w-full px-8 py-4 bg-[#0A0B0D] border-t border-slate-800/80 shrink-0 font-mono text-xs">
        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
          Need help with team configuration?{" "}
          <a href="#" className="text-slate-400 underline hover:text-slate-200">
            View Governance Policy
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleFooterSubmit}
            className="px-6 py-2.5 text-xs font-mono font-bold text-slate-950 bg-[#FF8A7A] hover:bg-[#ff7b6b] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-red-500/10 transition-all uppercase cursor-pointer"
          >
            {isSubmitting ? "Creating..." : "Create Team"}
          </button>
        </div>
      </div>
    </div>
  );
}