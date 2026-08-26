
import { useState, useRef } from "react";
import { RxMagnifyingGlass } from "react-icons/rx";
import { AiOutlineBell } from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import AddMemberModal from "../../components/AddMembers/AddMemberModal";
import TeamForm from "../../components/CreateTeam/TeamForm";
import CategorySection from "../../components/CreateTeam/CategorySection";
import TeamLeadSelect from "../../components/CreateTeam/TeamLeadSelect";
import EntityPreview from "../../components/CreateTeam/EntityPreview";
import TeamCreatedModal from "../../components/CreateTeam/TeamCreatedModal";

import useContextNavigator from "../../hooks/useContextNavigator";

const INITIAL_FORM_STATE = {
  teamName: "",
  teamCode: "",
  description: "",
  category: "",
  teamLead: null,
};

export default function CreateTeam() {
  const formRef = useRef();
  const navigate = useNavigate();

  // =====================================================
  // Current Workspace
  // =====================================================

  const { currentWorkspaceId } = useContextNavigator();

  // =====================================================
  // Component States
  // =====================================================

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const [createdTeam, setCreatedTeam] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showMemberModal, setShowMemberModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [resetFormTrigger, setResetFormTrigger] = useState(false);

  // =====================================================
  // Form Handlers
  // =====================================================

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategorySelect = (categoryLabel) => {
    handleInputChange("category", categoryLabel);
  };

  const handleTeamLeadSelect = (leadObj) => {
    handleInputChange("teamLead", leadObj);
  };

  // =====================================================
  // Reset Form
  // =====================================================

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setCreatedTeam(null);

    setResetFormTrigger((prev) => !prev);
  };

  // =====================================================
  // Footer Submit
  // =====================================================

  const handleFooterSubmit = (e) => {
    e.preventDefault();

    formRef.current?.requestSubmit();
  };

  // =====================================================
  // Get Lead ID
  // =====================================================

  const getLeadId = (lead) => {
    if (!lead) return null;

    if (typeof lead === "string") {
      return lead;
    }

    return lead._id || lead.id || null;
  };

  // =====================================================
  // Go To Team Details
  // =====================================================

  const goToTeamDetails = (team) => {
    if (!team?._id) {
      toast.error("Team ID is missing");
      return;
    }

    if (!currentWorkspaceId) {
      toast.error("Workspace is not selected");
      return;
    }

    navigate(
      `/workspaces/${currentWorkspaceId}/teams/${team._id}`
    );
  };

  // =====================================================
  // Main Submit
  // =====================================================

  const handleFinalSubmit = async (basicFormData) => {
    if (isSubmitting) {
      return;
    }

    // -----------------------------------------------------
    // Workspace Validation
    // -----------------------------------------------------

    if (!currentWorkspaceId) {
      toast.error("Please select a workspace first");
      return;
    }

    // -----------------------------------------------------
    // Category Validation
    // -----------------------------------------------------

    if (!formData.category) {
      toast.error("Please select a team category");
      return;
    }

    // -----------------------------------------------------
    // Team Lead Validation
    // -----------------------------------------------------

    const leadId = getLeadId(formData.teamLead);

    if (!leadId) {
      toast.error("Please assign a valid team lead");
      return;
    }

    setIsSubmitting(true);

    // =====================================================
    // Create Payload
    // =====================================================

    const payload = {
      teamName: basicFormData.teamName.trim(),

      teamCode: basicFormData.teamCode
        .trim()
        .toUpperCase(),

      description: basicFormData.description.trim(),

      category: formData.category,

      teamLead: leadId,

      workspaceId: currentWorkspaceId,

      responsibilities: [],

      members: [],

      status: "active",
    };

    console.log("Creating team with payload:", payload);

    try {
      // ===================================================
      // Create Team API
      // ===================================================

      const response = await api.post(
        "/teams",
        payload
      );

      console.log(
        "Create Team Response:",
        response.data
      );

      // ===================================================
      // Get Created Team
      // ===================================================

      const team =
        response.data?.team ||
        response.data?.data ||
        response.data;

      if (!team?._id) {
        throw new Error(
          "Team was created but no team ID was returned."
        );
      }

      // ===================================================
      // Success
      // ===================================================

      setCreatedTeam(team);

      setShowSuccessModal(true);

      toast.success("Team created successfully!");
    } catch (err) {
      console.error(
        "Failed to create team:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.msg ||
        err.message ||
        "Failed to create team";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // =====================================================
  // Leader Full Name
  // =====================================================

  const getLeaderFullName = () => {
    const lead = formData.teamLead;

    if (!lead) {
      return "Unassigned";
    }

    if (typeof lead === "string") {
      return lead;
    }

    const fullName =
      `${lead.firstName || ""} ${lead.lastName || ""}`.trim();

    return (
      fullName ||
      lead.name ||
      lead.username ||
      "Unassigned"
    );
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="flex flex-col w-full h-screen text-white bg-[#0A0B0D]">

      {/* =================================================
          TOP NAVBAR
      ================================================= */}

      <nav className="flex items-center justify-between w-full h-16 px-8 bg-[#0A0B0D] border-b border-slate-800/60 shadow-lg shrink-0">

        <div className="flex items-center gap-3">

          <h3 className="font-mono text-xs tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer uppercase">
            System Atlas
          </h3>

          <span className="text-slate-600">
            |
          </span>

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
              className="bg-[#0d0f14] border border-slate-800 pl-9 pr-4 py-1.5 rounded-lg text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-700 font-mono w-72"
            />

          </div>

          <AiOutlineBell className="text-xl text-slate-400 hover:text-white cursor-pointer transition-colors" />

        </div>

      </nav>


      {/* =================================================
          MAIN CONTAINER
      ================================================= */}

      <div className="flex-1 min-h-0 w-full overflow-y-auto p-8 bg-[#0D0E11CC]">

        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-8 items-start">

          {/* =============================================
              LEFT COLUMN
          ============================================= */}

          <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">

            <TeamForm
              formRef={formRef}
              onInputChange={handleInputChange}
              onFinalSubmit={handleFinalSubmit}
              resetTrigger={resetFormTrigger}
            />


            <CategorySection
              selectedCategory={formData.category}
              onSelectCategory={handleCategorySelect}
              resetTrigger={resetFormTrigger}
            />


            <TeamLeadSelect
              value={formData.teamLead}
              onChange={handleTeamLeadSelect}
              resetTrigger={resetFormTrigger}
            />

          </div>


          {/* =============================================
              RIGHT COLUMN
          ============================================= */}

          <div className="col-span-12 lg:col-span-4 sticky top-0">

            <EntityPreview
              teamName={formData.teamName}
              teamCode={formData.teamCode}
              leaderName={getLeaderFullName()}
            />

          </div>

        </div>

      </div>


      {/* =================================================
          ADD MEMBER MODAL
      ================================================= */}

      <AddMemberModal
        isOpen={showMemberModal}
        team={createdTeam}

        onClose={() => {
          setShowMemberModal(false);
        }}

        onGoToTeam={() => {
          goToTeamDetails(createdTeam);
        }}
      />


      {/* =================================================
          TEAM CREATED MODAL
      ================================================= */}

      <TeamCreatedModal
        isOpen={showSuccessModal}
        team={createdTeam}

        onAddMembers={() => {
          setShowSuccessModal(false);
          setShowMemberModal(true);
        }}

        onGoToTeam={() => {
          goToTeamDetails(createdTeam);
        }}

        onCreateAnother={() => {
          setShowSuccessModal(false);
          resetForm();
        }}

        onClose={() => {
          setShowSuccessModal(false);
        }}
      />


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="flex items-center justify-between w-full px-8 py-4 bg-[#0A0B0D] border-t border-slate-800/80 shrink-0 font-mono text-xs">

        <div className="flex items-center gap-2 text-slate-500 text-[11px]">

          <span className="w-2 h-2 rounded-full bg-slate-600" />

          Need help with team configuration?

          <a
            href="#"
            className="text-slate-400 underline hover:text-slate-200"
          >
            View Governance Policy
          </a>

        </div>


        <div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleFooterSubmit}
            className="px-6 py-2.5 text-xs font-mono font-bold text-slate-950 bg-[#FF8A7A] hover:bg-[#ff7b6b] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg shadow-red-500/10 transition-all uppercase cursor-pointer"
          >
            {isSubmitting
              ? "Creating..."
              : "Create Team"}
          </button>

        </div>

      </footer>

    </div>
  );
}


