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
  const { currentStep, setCurrentStep, status } = useWizard();

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

  const handleStepClick = (stepId, isClickable) => {
    if (isFinishedWizard || !isClickable) return;
    setCurrentStep(stepId);
  };

  return (
    <div className="flex items-center justify-center w-full gap-3 p-4 bg-[#0A0B0D]">
      {WIZARD_STEPS.map((step, idx) => {
        const isCompleted = idx < activeIndex;
        const isActive = idx === activeIndex;
        const isClickable = isCompleted && !isFinishedWizard;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => handleStepClick(step.id, isClickable)}
            disabled={!isClickable}
            title={
              isCompleted
                ? `${idx + 1}. ${step.label} (Completed - click to edit)`
                : isActive
                ? `${idx + 1}. ${step.label} (Current)`
                : `${idx + 1}. ${step.label}`
            }
            className={`group relative flex items-center w-36 sm:w-45 h-5 focus:outline-none transition-transform ${
              isClickable
                ? "cursor-pointer active:scale-95"
                : "cursor-default"
            }`}
            aria-label={
              isClickable
                ? `Navigate to ${step.label}`
                : `${step.label} ${isActive ? "(Current)" : "(Upcoming)"}`
            }
          >
            {/* Dot at the beginning of the current bar */}
            {isActive && (
              <span className="absolute -left-1 w-2.5 h-2.5 rounded-full bg-(--primary) shadow-[0_0_10px_var(--primary)] ring-2 ring-(--primary)/30 z-10 animate-pulse" />
            )}

            {/* Progress Bar */}
            <div
              className={`w-full h-0.5 rounded transition-all duration-300 ${
                isCompleted
                  ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] group-hover:h-1 group-hover:bg-emerald-300"
                  : isActive
                  ? "bg-(--primary) shadow-[0_0_8px_rgba(173,198,255,0.6)]"
                  : "bg-[#2D303A]"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
