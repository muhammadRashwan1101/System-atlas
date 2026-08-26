import { BiRightArrowAlt, BiArrowBack } from "react-icons/bi";
import { MdOutlineCancel } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useWizard from "../../../context/WizardContext";

export default function WizardNavigation() {
  const navigate = useNavigate();
  const { prevStep, currentStep, status } = useWizard();

  const isFirstStep = currentStep === 0 || currentStep === "basicInfo";
  const isReviewStep = currentStep === 5 || currentStep === "review";
  const isFinished = status === "finished" || currentStep === "completed";

  if (isFinished) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between w-full p-4 px-6 bg-(--main-bg) border-t border-(--border)/40 font-(family-name:--labels) text-sm">
      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="py-2 px-3 text-sm font-semibold rounded-lg text-[#FF8A80] uppercase hover:text-[#FF8A80]/80 hover:bg-[#FF8A8020] transform ease-in-out duration-200 cursor-pointer"
        >
          Cancel
        </button>
      </div>
      <div className="flex items-center gap-10">
        {!isFirstStep && (
          <button
            type="button"
            onClick={prevStep}
            className="flex gap-2 items-center text-sm text-(--text) hover:text-white transition-colors cursor-pointer"
          >
            <BiArrowBack />
            Back
          </button>
        )}
        <button
          type="submit"
          form="wizard-step-form"
          className="flex gap-2 items-center px-6 py-2 text-sm font-medium text-(--text-primary) bg-(--primary) rounded-lg shadow-none hover:bg-(--primary)/90 hover:shadow-[0px_0px_7px_rgba(173,198,255,0.6)] transform ease-in-out duration-300 cursor-pointer"
        >
          {isReviewStep ? "Confirm & Create Node" : "Continue"}
          <BiRightArrowAlt className="text-lg" />
        </button>
      </div>
    </nav>
  );
}