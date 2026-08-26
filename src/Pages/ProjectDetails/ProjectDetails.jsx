import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import ProjectNavbar from "../../components/ProjectDetials/ProjectNavbar";
import ProjectHeader from "../../components/ProjectDetials/ProjectHeader";
import ProjectStats from "../../components/ProjectDetials/ProjectStats";
import TechnologyStack from "../../components/ProjectDetials/TechnologyStack";
import OwnershipSection from "../../components/ProjectDetials/OwnershipSection";
import GovernanceChecklist from "../../components/ProjectDetials/GovernanceChecklist";
import ProjectInfoCard from "../../components/ProjectDetials/ProjectInfoCard";
import CriticalFindings from "../../components/ProjectDetials/CriticalFindings";
import ArchitectureSummary from "../../components/ProjectDetials/ArchitectureSummary";
import ArchitectureEvents from "../../components/ProjectDetials/ArchitectureEvents";

const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:3000/api";

export default function ProjectDetails() {
  const { workspaceId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: token ? `Bearer ${token}` : "" };

        const projRes = await axios.get(
          `${API_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}`,
          { headers }
        );

   
        const data = projRes.data?.project || projRes.data || {};
        const formattedProject = {
          ...data,
          techStack: data.techStack || data.tech_stack || {},
          teams: data.teams || data.owners || [],
          governanceChecklist: data.governanceChecklist || data.governance_checklist || [],
          criticalFindings: data.criticalFindings || data.critical_findings || [],
          events: data.events || data.architecture_events || [],
          info: {
            businessDomain: data.info?.businessDomain || data.business_domain,
            businessOwner: data.info?.businessOwner || data.business_owner,
            productManager: data.info?.productManager || data.product_manager,
            archVersion: data.info?.archVersion || data.arch_version || data.version,
          },
        };

        setProject(formattedProject);

        const compRes = await axios.get(
          `${API_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}/components`,
          { headers }
        );
        setComponents(compRes.data?.components || compRes.data || []);
      } catch (err) {
        console.error("Error fetching project details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId && projectId) {
      fetchData();
    }
  }, [workspaceId, projectId]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#07080c] flex items-center justify-center font-mono text-slate-400">
        <span className="animate-pulse">Loading project details...</span>
      </div>
    );
  }


  const hasComponents = Array.isArray(components) && components.length > 0;
  const hasStats = project?.stats && Object.keys(project.stats).length > 0;
  const hasRelationships = Array.isArray(project?.relationships) && project.relationships.length > 0;

  return (

    <div className="w-full h-screen bg-[#07080c] flex flex-col font-mono text-slate-100 overflow-hidden">
      <ProjectNavbar projectName={project?.name || project?.title} />

  
      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4 max-w-[1600px] w-full mx-auto">
        

        <ProjectHeader project={project} />

      
        {(hasComponents || hasStats) && (
          <ProjectStats
            stats={project?.stats}
            components={components}
            relationships={project?.relationships}
          />
        )}

    
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full items-start">
          
        
          <div className="lg:col-span-2 space-y-4">
            <TechnologyStack techStack={project?.techStack} />
            <OwnershipSection teams={project?.teams} />
            <GovernanceChecklist checklist={project?.governanceChecklist} />
          </div>

 
          <div className="space-y-4">
            {project?.criticalFindings?.length > 0 && (
              <CriticalFindings findings={project.criticalFindings} />
            )}
            
            <ProjectInfoCard info={project?.info} />

            {(hasComponents || hasRelationships) && (
              <ArchitectureSummary
                components={components}
                relationships={project?.relationships}
              />
            )}

            <ArchitectureEvents events={project?.events} />
          </div>

        </div>
      </main>
    </div>
  );
}