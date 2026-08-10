import BasicInfo from "../../wizardContent/BasicInfo";
import Documentation from "../../wizardContent/Documentation";
import OwnerShip from "../../wizardContent/OwnerShip";
import Relationships from "../../wizardContent/Relationships";
import TechStack from "../../wizardContent/TechStack";
import WizardReview from "../../wizardContent/WizardReview";
import ComponentPreview from "../componentPreview/ComponentPreview";



export default function StepContainer({wizard, setWizard}) {
  const renderStep = () => {
    switch(wizard.currentStep) {
      case("basicInfo"): {
        return <BasicInfo />
      }
      case("techStack"):
        return <TechStack />
      case("ownership"):
        return <OwnerShip />
      case("documentation"):
        return <Documentation />
      case("relationship"):
        return <Relationships />
      case("review"): 
        return <WizardReview />
      default:
        return (
            <div>
                Invalid wizard step.
            </div>
        );
    }
  }
  return (
    <div className="grid grid-cols-3 items-center px-10 bg-[#0A0B0D] w-full h-full">
        <ComponentPreview />
        <div className="flex items-center w-full h-full col-span-1">
          {renderStep()}
        </div>
    </div>
  )
}
