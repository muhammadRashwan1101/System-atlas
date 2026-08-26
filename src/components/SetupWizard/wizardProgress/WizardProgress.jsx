import { FiCheck } from "react-icons/fi";
import useWizard from "../../../context/WizardContext";

const WIZARD_STEPS = [
  { id: "basicInfo", label: "Basic Info", index: 0 },
  { id: "techStack", label: "Tech Stack", index: 1 },
  { id: "ownership", label: "Ownership", index: 2 },
  { id: "relationships", label: "Relationships", index: 3 },
  { id: "documentation", label: "Documentation", index: 4 },
  { id: "review", label: "Review", index: 5 },
];

export default function WizardProgress() {
  const { currentStep, setCurrentStep, status, wizardId, data } = useWizard();

  const getStepIndex = (step) => {
    if (typeof step === "number") return step;
    switch (step) {
      case "basicInfo":
        return 0;
      case "techStack":
        return 1;
      case "ownership":
        return 2;
      case "relationship":
      case "relationships":
        return 3;
      case "documentation":
        return 4;
      case "review":
        return 5;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentStep);
  const isFinishedWizard = status === "finished" || currentStep === "completed";

  // Check if a step has data
  const isStepComplete = (stepId, idx) => {
    if (stepId === "basicInfo") {
      return Boolean(
        data?.basicInfo?.name &&
          (data?.basicInfo?.type || data?.basicInfo?.componentType)
      );
    }
    if (stepId === "techStack") {
      return Boolean(
        (Array.isArray(data?.techStack?.technologies) &&
          data.techStack.technologies.length > 0) ||
          data?.basicInfo?.techStack
      );
    }
    if (stepId === "ownership") {
      return Boolean(
        data?.ownership?.ownerTeam ||
          data?.ownership?.ownerRefCode ||
          data?.basicInfo?.ownerTeam
      );
    }
    if (stepId === "relationships") {
      // Complete if configured relationships exist or step has been saved
      return Boolean(
        Array.isArray(data?.relationships) && data.relationships.length > 0
      );
    }
    if (stepId === "documentation") {
      return Boolean(
        data?.documentation?.repoURL ||
          data?.documentation?.docsURL ||
          data?.documentation?.monitorURL ||
          data?.documentation?.deploymentURL ||
          (Array.isArray(data?.documentation?.tags) &&
            data.documentation.tags.length > 0)
      );
    }
    return false;
  };

  const handleStepClick = (stepId, isClickable) => {
    if (isFinishedWizard || !isClickable) return;
    setCurrentStep(stepId);
  };

  return (
    <div className="flex items-center justify-center w-full px-6 py-3 bg-[#0A0B0D] border-b border-[#1E2025]/80 select-none">
      <div className="flex items-center justify-between w-full max-w-4xl gap-1 sm:gap-2">
        {WIZARD_STEPS.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isCompleted = isStepComplete(step.id, idx);
          // If session or component exists, all steps are unlocked for direct editing; otherwise completed/visited steps are unlocked
          const isClickable =
            !isFinishedWizard &&
            (Boolean(wizardId) || idx <= activeIndex || isCompleted);

          return (
            <div
              key={step.id}
              className="flex items-center flex-1 last:flex-none"
            >
              <button
                type="button"
                onClick={() => handleStepClick(step.id, isClickable)}
                disabled={!isClickable}
                title={
                  isClickable
                    ? `Click to edit Step ${idx + 1}: ${step.label}`
                    : `Step ${idx + 1}: ${step.label}`
                }
                className={`group flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-sky-500/15 border border-sky-400/40 text-white shadow-[0_0_12px_rgba(56,189,248,0.2)]"
                    : isClickable
                    ? "hover:bg-white/5 text-(--text)/70 hover:text-white cursor-pointer"
                    : "text-(--text)/30 cursor-not-allowed"
                }`}
                aria-label={`Step ${idx + 1}: ${step.label} ${
                  isActive ? "(Current)" : ""
                }`}
              >
                {/* Step Number / Checkmark Badge */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold transition-all shrink-0 ${
                    isActive
                      ? "bg-sky-400 text-black shadow-md shadow-sky-400/40 scale-105"
                      : isCompleted
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-400/40"
                      : "bg-[#1E2025] text-(--text)/50 border border-(--border)/30"
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <FiCheck className="text-xs" />
                  ) : (
                    idx + 1
                  )}
                </div>

                {/* Step Title Label */}
                <span
                  className={`text-xs font-(family-name:--labels) font-medium hidden sm:inline whitespace-nowrap ${
                    isActive
                      ? "text-white font-semibold"
                      : isCompleted
                      ? "text-[#C4C6D0]"
                      : "text-(--text)/50"
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* Connecting Progress Line */}
              {idx < WIZARD_STEPS.length - 1 && (
                <div
                  className={`flex-1 h-[2px] mx-1 sm:mx-2 rounded-full transition-all duration-300 ${
                    idx < activeIndex
                      ? "bg-emerald-500/60 shadow-[0_0_6px_rgba(52,211,153,0.4)]"
                      : idx === activeIndex
                      ? "bg-gradient-to-r from-sky-400 to-[#1E2025]"
                      : "bg-[#1E2025]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

