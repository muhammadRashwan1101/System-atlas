import Style from "./preview.module.css";
import useWizard from "../../../../context/WizardContext";

export default function ComponentPreview() {
  const { data, wizardId } = useWizard();
  const basicInfo = data?.basicInfo || {};

  return (
    <div className={`flex flex-col justify-center items-center col-span-2 ${Style.cardWrapper}`}>
      <div
        className={`${Style.card} flex flex-col items-start gap-8 w-120 h-full border border-[#44474F30] rounded-[10px] bg-[#131519] p-8`}
      >
        <div className="gap-2 border border-[#D8E2FF20] p-2 text-sm rounded-md bg-[#D8E2FF10] font-(family-name:--labels)">
          <h2>{basicInfo.type || basicInfo.componentType || "Component Type"}</h2>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-(family-name:--headers) font-semibold text-3xl break-words max-w-[360px]">
            {basicInfo.name || basicInfo.componentName || "Untitled Component"}
          </h2>
          <h3 className="font-(family-name:--labels) text-xs text-[#C4C6D0]/60">
            ID: {wizardId || basicInfo.id || "xxxxxxxx"}
          </h3>
        </div>
        <div className="flex flex-col gap-2 border-b pb-4 w-full border-[#44474F30]">
          <h3 className="font-(family-name:--labels) text-xs text-[#C4C6D0]/60 uppercase">
            Technology Stack
          </h3>
          <h2>{basicInfo.techStack || "Unassigned"}</h2>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-1 text-sm">
            <h3 className="font-(family-name:--labels) text-xs text-[#C4C6D0]/60 uppercase">
              Owner Team
            </h3>
            <h2>{basicInfo.ownerTeam || "Unassigned"}</h2>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            <h3 className="font-(family-name:--labels) text-xs text-[#C4C6D0]/60 uppercase">
              Environment
            </h3>
            <h2>{basicInfo.environment || "Unplanned"}</h2>
          </div>
        </div>
        <div className=" flex flex-col gap-1 text-sm">
          <h3 className="font-(family-name:--labels) text-xs text-[#C4C6D0]/60 uppercase">
            Technical lead
          </h3>
          <h2>{basicInfo.technicalLead || "Unassigned"}</h2>
        </div>
      </div>
    </div>
  );
}
