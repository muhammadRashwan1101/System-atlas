import TopologyPreview from "../../components/CreateWorkspace/TopologyPreview";
import WorkspaceForm from "../../components/CreateWorkspace/WorkspaceForm";
import AdminWelcomeScreen from "../../components/CreateWorkspace/AdminWelcomeScreen";
import { useRef, useState, useEffect } from "react";
import useAuth from "../../context/AuthContext";
import { FiHelpCircle } from "react-icons/fi";
import { useSearchParams } from "react-router-dom";

export default function WorkspaceCreation() {
  const formRef = useRef();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract onboarding value
  const onboardingVal =
    user?.user?.onboarding !== undefined
      ? user.user.onboarding
      : user?.user?.onboardingStatus !== undefined
      ? user.user.onboardingStatus
      : user?.onboarding !== undefined
      ? user.onboarding
      : user?.onboardingStatus || "pending";

  const rawRole = user?.role || user?.user?.role || "user";
  const userRole = String(rawRole).toLowerCase();

  // Start with welcome screen if admin with pending onboarding or requested via query param
  const isDirectForm = searchParams.get("view") === "form";
  const [currentStep, setCurrentStep] = useState(
    !isDirectForm && (userRole === "admin" || userRole === "manager") && onboardingVal !== "completed"
      ? "welcome"
      : "form"
  );

  useEffect(() => {
    // If user state loads and indicates pending onboarding for admin/manager, show welcome
    if (!isDirectForm && (userRole === "admin" || userRole === "manager") && onboardingVal !== "completed") {
      const hasDismissed = sessionStorage.getItem("adminWelcomeDismissed");
      if (!hasDismissed) {
        setCurrentStep("welcome");
      }
    }
  }, [user, userRole, onboardingVal, isDirectForm]);

  const handleProceedToForm = () => {
    sessionStorage.setItem("adminWelcomeDismissed", "true");
    setCurrentStep("form");
    setTimeout(() => {
      const input = document.getElementById("workspaceName");
      if (input) input.focus();
    }, 150);
  };

  const handleShowWelcome = () => {
    setCurrentStep("welcome");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  if (currentStep === "welcome") {
    return <AdminWelcomeScreen onProceedToForm={handleProceedToForm} />;
  }

  return (
    <div className="flex flex-col w-full h-screen bg-(--main-bg)">
      <div className="flex flex-1 items-center min-h-0 w-full bg-(--main-bg)">
        <div className="flex items-start w-full h-full">
          <WorkspaceForm formRef={formRef} />
          <TopologyPreview />
        </div>
      </div>
      <div className="flex items-center justify-between w-full py-5 border-t border-(--border)/40 ps-30 pe-20 font-(family-name:--labels) text-(--text) text-sm">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="py-2 px-2 text-sm font-semibold rounded-lg text-[#FF8A80] uppercase hover:text-[#FF8A80]/80 hover:bg-[#FF8A8020] transform ease-in-out duration-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleShowWelcome}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-mono text-slate-400 hover:text-sky-400 hover:bg-sky-500/10 border border-transparent hover:border-sky-500/20 transition-all cursor-pointer"
            title="Review Onboarding Guide"
          >
            <FiHelpCircle className="w-3.5 h-3.5" />
            <span>Onboarding Guide</span>
          </button>
        </div>
        <div className="flex gap-10">
          <button
            className="px-6 py-2 text-sm font-medium text-(--text-primary) bg-(--primary) rounded-lg shadow-none hover:bg-(--primary)/90 hover:shadow-[0px_0px_7px_rgba(173,198,255,0.6)] transform ease-in-out duration-300 uppercase cursor-pointer"
            onClick={handleSubmit}
          >
            Create Workspace
          </button>
        </div>
      </div>
    </div>
  );
}