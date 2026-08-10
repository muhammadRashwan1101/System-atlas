import WizardHeader from "../../components/SetupWizard/wizardHeader/WizardHeader"
import WizardProgress from "../../components/SetupWizard/wizardProgress/WizardProgress"
import WizardNavigation from "../../components/SetupWizard/wizardNavigation/WizardNavigation"
import { useParams } from "react-router-dom";
import StepContainer from "../../components/SetupWizard/wizardStepContainer/stepContainer/StepContainer";
import { useEffect, useState } from "react";
import api from "../../api/axios";
export default function SetupWizard() {
    const {projectId, wizardId} = useParams();
    const [wizard, setWizard] = useState(null)

    useEffect(() => {
        const getWizard = async () => {
            if(!projectId || !wizardId) {
                setWizard({
                    currentStep: "basicInfo"
                })
            }
            const res = await api.get(`/projects/${projectId}/wizard/${wizardId}`)

            console.log(res?.data?.wizard)
            setWizard(res?.data?.wizard)
        }
        
        getWizard()
    }, [projectId, wizardId])
    //Header is counting the steps
    //left side is fixed only populating the new data each time
    //right side is changing based on the step

    return (
        <>
        <div className="flex flex-col w-full h-screen">
            <WizardHeader />
            <WizardProgress />
            <div className="flex items-center p-4 justify-center bg-[#0A0B0D] w-full h-full">
                {wizard && (
                    <StepContainer wizard={wizard} setWizard={setWizard} />
                )}
            </div>
            <WizardNavigation />
        </div>
        </>
    )
}