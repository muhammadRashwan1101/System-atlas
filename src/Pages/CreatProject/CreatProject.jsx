import { useState, useRef } from "react";
import ProjectForm from "../../components/CreatProject/ProjectForm";
import ProjecPreview from "../../components/CreatProject/ProjecPreview";
import { useParams, useNavigate } from "react-router-dom";

export default function ProjectCreation() {
  const formRef = useRef();
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [projectSummary, setProjectSummary] = useState({
    name: "",
    managerName: "",
    department: "",
    targetEnvironment: "",
    systemTopology: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-(--main-bg) overflow-hidden">
      <div className="flex flex-1 items-center min-h-0 w-full bg-(--main-bg) overflow-y-auto">
        <div className="flex items-start w-full h-full">
          <ProjectForm
            formRef={formRef}
            projectSummary={projectSummary}
            setProjectSummary={setProjectSummary}
          />
          <ProjecPreview projectSummary={projectSummary} />
        </div>
      </div>
      <div className="flex items-center justify-between w-full py-5 border-t border-(--border)/40 ps-30 pe-20 font-(family-name:--labels) text-(--text) text-sm shrink-0 bg-(--main-bg)">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate(workspaceId ? `/workspaces/${workspaceId}` : "/app")}
            className="py-2 px-2 text-sm font-semibold rounded-lg text-[#FF8A80] uppercase hover:text-[#FF8A80]/80 hover:bg-[#FF8A8020] transform ease-in-out duration-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
        <div className="flex gap-10">
          <button
            className="px-6 py-2 text-sm font-medium text-(--text-primary) bg-(--primary) rounded-lg shadow-none hover:bg-(--primary)/90 hover:shadow-[0px_0px_7px_rgba(173,198,255,0.6)] transform ease-in-out duration-300 uppercase cursor-pointer"
            onClick={handleSubmit}
          >
            Initialize Project
          </button>
        </div>
      </div>
    </div>
  );
}