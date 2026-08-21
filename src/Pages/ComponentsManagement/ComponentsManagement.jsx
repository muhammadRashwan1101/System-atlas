import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import ComponentsHeader from "../../components/ComponentsManagement/ComponentsHeader";
import ComponentsTitleSection from "../../components/ComponentsManagement/ComponentsTitleSection";
import ComponentsFilterBar from "../../components/ComponentsManagement/ComponentsFilterBar";
import ComponentCard from "../../components/ComponentsManagement/ComponentCard";
import NewComponentCard from "../../components/ComponentsManagement/NewComponentCard";
import ComponentListView from "../../components/ComponentsManagement/ComponentListView";
import { getIconType } from "../../components/ComponentsManagement/componentUtils";
import useWorkspace from "../../context/WorkspaceContext";



export default function ComponentsManagement() {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const { workspaces, projectsByWorkspace, fetchProjects } = useWorkspace();

  const activeWorkspace = useMemo(() => {
    return workspaces.find((w) => w._id === workspaceId) || null;
  }, [workspaces, workspaceId]);

  const activeProject = useMemo(() => {
    const prjs = projectsByWorkspace[workspaceId] || [];
    return prjs.find((p) => p._id === projectId) || null;
  }, [projectsByWorkspace, workspaceId, projectId]);

  // If projects are not yet fetched for this workspace, load them
  useEffect(() => {
    if (workspaceId && !projectsByWorkspace[workspaceId]) {
      fetchProjects(workspaceId);
    }
  }, [workspaceId, projectsByWorkspace, fetchProjects]);

  // State
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedTech, setSelectedTech] = useState("Any");
  const [selectedEnv, setSelectedEnv] = useState("All");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [sortBy, setSortBy] = useState("recent"); // "recent" | "name" | "relationships"

  // Dropdown open states
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);
  const [isEnvDropdownOpen, setIsEnvDropdownOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);



  // Fetch real components from backend API if projectId is present
  useEffect(() => {
    let isMounted = true;
    const fetchComponents = async () => {
      if (!projectId) return;
      setLoading(true);
      try {
        const res = await api.get(`/projects/${projectId}/components`);
        const fetched = res.data?.components || res.data?.data || res.data || [];
        if (isMounted && Array.isArray(fetched) && fetched.length > 0) {
          const normalized = fetched.map((c) => ({
            _id: c._id || `CMP-${Math.random().toString(36).substring(2, 6)}`,
            name: c.name || "Untitled Component",
            type: c.type
              ? c.type.charAt(0).toUpperCase() + c.type.slice(1)
              : "Backend Service",
            componentType: c.type || "backend",
            environment:
              c.deploymentEnvironment ||
              c.environment ||
              "Production",
            ownerTeam:
              (typeof c.ownerTeam === "object" ? c.ownerTeam?.teamName : null) ||
              c.ownerRefCode ||
              "Platform Team",
            technologies: Array.isArray(c.technologies) ? c.technologies : [],
            relationshipsCount: Array.isArray(c.relationships)
              ? c.relationships.length
              : Math.floor(Math.random() * 15) + 1,
            status: c.status === "inactive" ? "WARNING" : "HEALTHY",
            iconType: getIconType(c.type),
          }));
          setComponents(normalized);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error("Failed to load components:", err);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchComponents();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // Extract all available types and technologies for dropdowns
  const availableTypes = useMemo(() => {
    const types = new Set(["All"]);
    components.forEach((c) => {
      if (c.type) types.add(c.type);
    });
    return Array.from(types);
  }, [components]);

  const availableTechs = useMemo(() => {
    const techs = new Set(["Any"]);
    components.forEach((c) => {
      if (Array.isArray(c.technologies)) {
        c.technologies.forEach((t) => techs.add(t));
      }
    });
    return Array.from(techs);
  }, [components]);

  // Filter and Sort Components
  const filteredComponents = useMemo(() => {
    return components
      .filter((c) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = c.name?.toLowerCase().includes(q);
          const matchesId = c._id?.toLowerCase().includes(q);
          const matchesTeam = c.ownerTeam?.toLowerCase().includes(q);
          const matchesTech = c.technologies?.some((t) =>
            t.toLowerCase().includes(q)
          );
          if (!matchesName && !matchesId && !matchesTeam && !matchesTech) {
            return false;
          }
        }
        if (selectedType !== "All" && c.type !== selectedType) {
          return false;
        }
        if (
          selectedTech !== "Any" &&
          !c.technologies?.some(
            (t) => t.toLowerCase() === selectedTech.toLowerCase()
          )
        ) {
          return false;
        }
        if (
          selectedEnv !== "All" &&
          c.environment?.toLowerCase() !== selectedEnv.toLowerCase()
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === "relationships") {
          return (b.relationshipsCount || 0) - (a.relationshipsCount || 0);
        }
        return 0;
      });
  }, [components, searchQuery, selectedType, selectedTech, selectedEnv, sortBy]);

  const handleResetFilters = () => {
    setSelectedType("All");
    setSelectedTech("Any");
    setSelectedEnv("All");
    setSearchQuery("");
    setSortBy("recent");
  };

  const handleAddNewComponent = () => {
    if (workspaceId && projectId) {
      navigate(`/workspaces/${workspaceId}/projects/${projectId}/wizard`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleInspect = (comp) => {
    console.log("Inspecting component:", comp);
  };

  const handleEdit = () => {
    if (workspaceId && projectId) {
      navigate(`/workspaces/${workspaceId}/projects/${projectId}/wizard`);
    } else {
      navigate("/dashboard");
    }
  };

  const handleExploreGraph = () => {
    if (workspaceId && projectId) {
      navigate(`/workspaces/${workspaceId}/projects/${projectId}/graph`);
    } else {
      navigate("/dashboard");
    }
  };


  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0A0B0D] text-white">
      {/* Top Header Bar */}
      <ComponentsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex flex-col p-8 gap-6 w-full max-w-[1600px] mx-auto">
        {/* Breadcrumb & Section Title */}
        <ComponentsTitleSection
          selectedEnv={selectedEnv}
          onAddNewComponent={handleAddNewComponent}
          workspaceName={activeWorkspace?.name}
          projectName={activeProject?.name}
        />


        {/* Filter and Control Bar */}
        <ComponentsFilterBar
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          availableTypes={availableTypes}
          isTypeDropdownOpen={isTypeDropdownOpen}
          setIsTypeDropdownOpen={setIsTypeDropdownOpen}
          selectedTech={selectedTech}
          setSelectedTech={setSelectedTech}
          availableTechs={availableTechs}
          isTechDropdownOpen={isTechDropdownOpen}
          setIsTechDropdownOpen={setIsTechDropdownOpen}
          selectedEnv={selectedEnv}
          setSelectedEnv={setSelectedEnv}
          isEnvDropdownOpen={isEnvDropdownOpen}
          setIsEnvDropdownOpen={setIsEnvDropdownOpen}
          onResetFilters={handleResetFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isSortDropdownOpen={isSortDropdownOpen}
          setIsSortDropdownOpen={setIsSortDropdownOpen}
        />

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredComponents.map((comp) => (
              <ComponentCard
                key={comp._id}
                comp={comp}
                onInspect={handleInspect}
                onEdit={handleEdit}
                onExploreGraph={handleExploreGraph}
              />
            ))}

            {/* "New Component" Dashed Card */}
            <NewComponentCard onClick={handleAddNewComponent} />
          </div>
        )}


        {/* List View */}
        {viewMode === "list" && (
          <ComponentListView components={filteredComponents} />
        )}
      </main>
    </div>
  );
}
