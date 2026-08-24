import { FiCpu } from "react-icons/fi";
import { BACKEND_TECHNOLOGIES } from "../../constants/technologies";

export default function TechnologyStackCard({ techStack = {}, rawTechnologies = [] }) {
  const {
    backend,
    database,
    cache,
    messaging,
    infrastructure,
  } = techStack;

  // Build categorized items from rawTechnologies or techStack
  const stackItems = [];

  if (backend) stackItems.push({ label: "BACKEND", value: backend });
  if (database) stackItems.push({ label: "DATABASE", value: database });
  if (cache) stackItems.push({ label: "CACHE", value: cache });
  if (messaging) stackItems.push({ label: "MESSAGING", value: messaging });
  if (infrastructure) stackItems.push({ label: "INFRASTRUCTURE", value: infrastructure });

  // If rawTechnologies are provided and stackItems is sparse, show all assigned technologies
  const allTechs = Array.isArray(rawTechnologies) && rawTechnologies.length > 0 ? rawTechnologies : [];

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
          <FiCpu className="text-sm" />
          <span>TECHNOLOGY STACK</span>
        </div>
        {allTechs.length > 0 && (
          <span className="text-[10px] font-mono text-[#8b949e]">
            {allTechs.length} Assigned {allTechs.length === 1 ? "Technology" : "Technologies"}
          </span>
        )}
      </div>

      {/* Structured Category Tiles */}
      {stackItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {stackItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-3.5 rounded-lg bg-[#161920] border border-[#232730] transition-colors hover:border-[#384152]"
            >
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8b949e] font-medium">
                {item.label}
              </span>
              <span className="text-xs font-medium text-white mt-1.5 font-mono">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      ) : allTechs.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {allTechs.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-[#161920] border border-[#232730] text-white text-xs font-mono font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-[#161920] border border-[#232730] text-center text-xs text-[#8b949e] font-mono">
          No technologies assigned to this component.
        </div>
      )}
    </div>
  );
}
