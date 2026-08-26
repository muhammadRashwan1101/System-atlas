import { useState, useEffect } from "react";
import WizardHeader from "../../components/SetupWizard/wizardHeader/WizardHeader";
import WizardProgress from "../../components/SetupWizard/wizardProgress/WizardProgress";
import WizardNavigation from "../../components/SetupWizard/wizardNavigation/WizardNavigation";
import StepContainer from "../../components/SetupWizard/wizardStepContainer/stepContainer/StepContainer";
import WizardProvider from "../../context/WizardProvider";
import useWizard from "../../context/WizardContext";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

function SetupWizardContent() {
  const { wizardId: paramWizardId, projectId } = useParams();
  const { initWizard, wizardId: contextWizardId, setWizardId } = useWizard();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (paramWizardId && paramWizardId !== contextWizardId) {
      setWizardId(paramWizardId);
    }

    if (paramWizardId) {
      const fetchWizard = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/projects/${projectId}/wizard/${paramWizardId}`);
          const wizard = response.data?.wizard || response.data;
          if (wizard) {
            initWizard({
              wizardId: wizard._id || paramWizardId,
              currentStep: wizard.currentStep || "basicInfo",
              status: wizard.status || "in_progress",
              data: wizard.data || {},
            });
          }
        } catch (err) {
          console.error("Failed to load wizard session:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchWizard();
    }
  }, [paramWizardId, projectId, contextWizardId, setWizardId, initWizard]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-[#0A0B0D] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-(--text)/70 font-light">Loading wizard session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen">
      <WizardHeader />
      <WizardProgress />
      <div className="flex items-center p-4 justify-center bg-[#0A0B0D] w-full h-full overflow-y-auto">
        <StepContainer />
      </div>
      <WizardNavigation />
    </div>
  );
}

export default function SetupWizard() {
  const { wizardId } = useParams();

  return (
    <WizardProvider
      initialValues={{
        wizardId: wizardId || null,
        currentStep: "basicInfo",
        status: "in_progress",
        data: {},
      }}
    >
      <SetupWizardContent />
    </WizardProvider>
  );
}

