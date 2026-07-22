import { useState } from "react";
import { useParams } from "react-router-dom";
import ProjectForm from "../../components/CreatProject/ProjectForm";
import ProjecPreview from "../../components/CreatProject/ProjecPreview";

export default function ProjectCreation() {

  const { workspaceId } = useParams();

  const [projectSummary, setProjectSummary] = useState({
    name: "",
    managerName: "",
    department: "",
    targetEnvironment: "",
    systemTopology: ""
  });


  return (
    <div className="flex">

      <ProjectForm
        projectSummary={projectSummary}
        setProjectSummary={setProjectSummary}
      />


      <ProjecPreview
        projectSummary={projectSummary}
      />

    </div>
  );
}