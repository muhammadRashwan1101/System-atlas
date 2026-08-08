import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TeamsHeader from "../../components/TeamManagmentDashboard/TeamsHeader";
import FilterDropdown from "../../components/TeamManagmentDashboard/FilterDropdown";
import TeamsFilters from "../../components/TeamManagmentDashboard/TeamsFilters";
import TeamGrid from "../../components/TeamManagmentDashboard/TeamGrid";
import TeamCard from "../../components/TeamManagmentDashboard/TeamCard";
export default function TeamsManagement() {

    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        workspace: "all",
        status: "all",
        lead: "all",
        size: "all",
    });

    const [view, setView] = useState("grid");


    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };


   return (
  <div
    className="min-h-screen w-full"
    style={{ backgroundColor: "var(--main-bg)" }}
  >
    <TeamsHeader
      onImport={() => {}}
      onExport={() => {}}
      onCreateTeam={() => navigate("/teams/create")}
    />

    <main className="px-8 py-6">
      <TeamsFilters
      
        filters={filters}
        onFilterChange={handleFilterChange}
        view={view}
        onViewChange={setView}
      />

      <section className="mt-6">
        <TeamGrid />
      </section>
    </main>
  </div>
);
}