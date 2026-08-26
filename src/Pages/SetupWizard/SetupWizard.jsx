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
          let wizardData = null;

          // 1. Try loading as an in-progress wizard session
          try {
            const response = await api.get(
              `/projects/${projectId}/wizard/${paramWizardId}`
            );
            wizardData =
              response.data?.wizard ||
              response.data?.currentWizard ||
              response.data;
          } catch (wizardErr) {
            // 2. If wizard session not found, try loading as an existing component for editing
            try {
              const compRes = await api.get(
                `/projects/${projectId}/components/${paramWizardId}`
              );
              const comp =
                compRes?.data?.component ||
                compRes?.data?.data ||
                compRes?.data;

              if (comp) {
                const techArr = Array.isArray(comp.technologies)
                  ? comp.technologies
                  : typeof comp.technologies === "string"
                  ? comp.technologies.split(",").map((s) => s.trim()).filter(Boolean)
                  : [];

                const rawTags = Array.isArray(comp.tags)
                  ? comp.tags
                  : Array.isArray(comp.documentation?.tags)
                  ? comp.documentation.tags
                  : [];

                wizardData = {
                  _id: comp._id || paramWizardId,
                  currentStep: "basicInfo",
                  status: "in_progress",
                  data: {
                    basicInfo: {
                      name: comp.name || "",
                      componentName: comp.name || "",
                      type: comp.type || "",
                      componentType: comp.type || "",
                      description: comp.description || "",
                      techStack: techArr.join(", "),
                    },
                    techStack: {
                      technologies: techArr,
                    },
                    ownership: {
                      ownerTeam:
                        typeof comp.ownerTeam === "object"
                          ? comp.ownerTeam?._id
                          : comp.ownerTeam || null,
                      ownerRefCode: comp.ownerRefCode || "",
                      technicalLead:
                        typeof comp.technicalLead === "object"
                          ? comp.technicalLead?._id
                          : comp.technicalLead || null,
                      maintainers: Array.isArray(comp.maintainers)
                        ? comp.maintainers
                        : [],
                      environment:
                        comp.environment ||
                        comp.deploymentEnvironment ||
                        "development",
                    },
                    documentation: {
                      repoURL:
                        comp.repoURL ||
                        comp.documentation?.repoURL ||
                        comp.documentation?.repository ||
                        "",
                      docsURL:
                        comp.docsURL ||
                        comp.documentation?.docsURL ||
                        comp.documentation?.docs ||
                        "",
                      monitorURL:
                        comp.monitorURL ||
                        comp.documentation?.monitorURL ||
                        comp.documentation?.monitor ||
                        "",
                      deploymentURL:
                        comp.deploymentURL ||
                        comp.documentation?.deploymentURL ||
                        comp.documentation?.deployment ||
                        "",
                      tags: rawTags,
                    },
                    relationships: Array.isArray(comp.relationships)
                      ? comp.relationships
                      : [],
                  },
                };
              }
            } catch (compErr) {
              console.error("Failed to load component for editing:", compErr);
            }
          }

          if (wizardData) {
            const rawData = wizardData.data || wizardData;
            initWizard({
              wizardId: wizardData._id || wizardData.wizardId || paramWizardId,
              currentStep: wizardData.currentStep || "basicInfo",
              status: wizardData.status || "in_progress",
              data: {
                basicInfo: rawData.basicInfo || {
                  name: rawData.name || rawData.componentName || "",
                  componentName: rawData.name || rawData.componentName || "",
                  type: rawData.type || rawData.componentType || "",
                  componentType: rawData.type || rawData.componentType || "",
                  description: rawData.description || "",
                },
                techStack: rawData.techStack || {
                  technologies: Array.isArray(rawData.technologies)
                    ? rawData.technologies
                    : [],
                },
                ownership: rawData.ownership || {
                  ownerTeam: rawData.ownerTeam || null,
                  ownerRefCode: rawData.ownerRefCode || "",
                  technicalLead: rawData.technicalLead || null,
                  maintainers: Array.isArray(rawData.maintainers)
                    ? rawData.maintainers
                    : [],
                  environment:
                    rawData.environment ||
                    rawData.deploymentEnvironment ||
                    "development",
                },
                documentation: rawData.documentation || {
                  repoURL: rawData.repoURL || "",
                  docsURL: rawData.docsURL || "",
                  monitorURL: rawData.monitorURL || "",
                  deploymentURL: rawData.deploymentURL || "",
                  tags: Array.isArray(rawData.tags) ? rawData.tags : [],
                },
                relationships: Array.isArray(rawData.relationships)
                  ? rawData.relationships
                  : [],
              },
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

