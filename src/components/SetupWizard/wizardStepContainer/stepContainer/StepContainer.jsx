import BasicInfo from "../../wizardContent/BasicInfo";
import Documentation from "../../wizardContent/Documentation";
import OwnerShip from "../../wizardContent/OwnerShip";
import Relationships from "../../wizardContent/Relationships";
import TechStack from "../../wizardContent/TechStack";
import WizardReview from "../../wizardContent/WizardReview";
import ComponentPreview from "../componentPreview/ComponentPreview";
import useWizard from "../../../../context/WizardContext";

export default function StepContainer() {
  const { currentStep } = useWizard();

  const renderStep = () => {
    switch (currentStep) {
      case 0:
      case "basicInfo":
        return <BasicInfo />;
      case 1:
      case "techStack":
        return <TechStack />;
      case 2:
      case "ownership":
        return <OwnerShip />;
      case 3:
      case "relationship":
      case "relationships":
        return <Relationships />;
      case 4:
      case "documentation":
        return <Documentation />;
      case 5:
      case "review":
        return <WizardReview />;
      default:
        return (
          <div className="text-sm text-(--text)/70 p-4 border border-(--border)/30 rounded-lg bg-(--secondary-bg)">
            Invalid wizard step.
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-3 items-center px-10 bg-[#0A0B0D] w-full h-full">
      <ComponentPreview />
      <div className="flex items-center w-full h-full col-span-1">
        {renderStep()}
      </div>
    </div>
  );
}

