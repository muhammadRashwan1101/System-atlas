import { useState, useEffect, useRef } from "react";
import { FiSearch, FiUserCheck } from "react-icons/fi";
import api from "../../api/axios";

export default function TeamLeadSelect({  value,
 onChange,
 resetTrigger }) {
  const [query, setQuery] = useState("");
  const [teamLeads, setTeamLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
 useEffect(()=>{
 if(resetTrigger){
   setSelectedLead(null);
   setQuery("");
 }
},[resetTrigger]);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTeamLeads = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `/team-leads/search?name=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );

        const leadsData = response.data?.data || response.data || [];
        setTeamLeads(leadsData);

        if (value && !selectedLead) {
          const leadId = typeof value === "object" ? value._id : value;
          const found = leadsData.find((user) => user._id === leadId);
          if (found) setSelectedLead(found);
        }
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          console.error("Error fetching team leads:", err);
        }
      }
      finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchTeamLeads();
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, value]);

  const getFullName = (lead) => {
    if (!lead) return "";
    if (lead.firstName || lead.lastName) {
      return `${lead.firstName || ""} ${lead.lastName || ""}`.trim();
    }
    return lead.name || lead.username || "Team Lead";
  };

  const handleSelect = (lead) => {
    setSelectedLead(lead);
    setIsDropdownOpen(false);
    setQuery("");
    if (onChange) onChange(lead);
  };

  const handleRemove = () => {
    setSelectedLead(null);
    if (onChange) onChange(null);
  };

  return (
    <div className="flex flex-col gap-3 w-full" ref={containerRef}>
      <div className="flex items-center gap-2 text-slate-400 font-mono text-xs uppercase tracking-wider">
        <FiUserCheck className="text-sm" />
        <span>Team Lead</span>
      </div>

      <div className="p-4 rounded-xl border border-slate-800/80 bg-[#0a0c10] w-full">
        {selectedLead ? (
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-slate-800/80 bg-[#0d0f14] w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center font-bold text-slate-300 text-sm">
                {getFullName(selectedLead)[0] || "L"}
              </div>
              <div className="flex flex-col">
                <span className="text-slate-100 font-semibold text-sm">
                  {getFullName(selectedLead)}
                </span>
                <span className="text-slate-400 font-mono text-[11px] tracking-wide mt-0.5">
                  {selectedLead.email}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded text-[11px] font-mono tracking-wider text-red-400 hover:text-red-300 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 transition-colors cursor-pointer uppercase"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="relative w-full">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#0d0f14] border border-slate-800/80 rounded-lg focus-within:border-slate-600 transition-colors">
              <FiSearch className="text-slate-500 text-lg" />
              <input
                type="text"
                placeholder="Search directory for a team lead..."
                value={query}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none font-sans"
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#0d0f14] border border-slate-800 rounded-lg shadow-xl max-h-52 overflow-y-auto z-20">
                {isLoading ? (
                  <div className="p-3 text-xs text-slate-500 font-mono text-center">
                    Loading directory...
                  </div>
                ) : teamLeads.length > 0 ? (
                  teamLeads.map((lead) => (
                    <button
                      key={lead._id}
                      type="button"
                      onClick={() => handleSelect(lead)}
                      className="w-full text-left p-3 flex items-center gap-3 hover:bg-slate-800/50 transition-colors border-b border-slate-800/40 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-md bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-xs">
                        {getFullName(lead)[0] || "L"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-200">
                          {getFullName(lead)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {lead.email}
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-xs text-slate-500 font-mono text-center">
                    No team leaders found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}