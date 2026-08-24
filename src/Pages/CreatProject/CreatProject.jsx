import { useState } from "react";
import ProjectForm from "../../components/CreatProject/ProjectForm";
import ProjecPreview from "../../components/CreatProject/ProjecPreview";

export default function ProjectCreation() {

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