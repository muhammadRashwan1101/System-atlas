import {
  FiFileText,
  FiCode,
  FiActivity,
  FiExternalLink,
  FiGithub,
  FiCheckCircle,
} from "react-icons/fi";
import { AiOutlineCloud } from "react-icons/ai";

export default function DocumentationGalleryCard({
  docs = [],
  onOpenDoc = () => {},
}) {
  const defaultDocs = [
    {
      id: "repo",
      title: "Source Repository",
      subtitle: "atlas/svc-rec",
      status: "VERIFIED",
      statusType: "success",
      icon: <FiGithub className="text-base text-white" />,
      url: "https://github.com",
    },
    {
      id: "swagger",
      title: "API Specification",
      subtitle: "OpenAPI / Swagger",
      status: "LIVE v2.4.0",
      statusType: "success",
      icon: <FiCode className="text-base text-white" />,
      url: "https://swagger.io",
    },
    {
      id: "monitor",
      title: "Telemetry & Monitor",
      subtitle: "Grafana / Metrics",
      status: "CONNECTED",
      statusType: "success",
      icon: <FiActivity className="text-base text-white" />,
      url: "https://grafana.com",
    },
    {
      id: "deploy",
      title: "Deployment Pipeline",
      subtitle: "GitHub Actions",
      status: "ACTIVE",
      statusType: "success",
      icon: <AiOutlineCloud className="text-base text-white" />,
      url: "https://github.com",
    },
  ];

  const items = Array.isArray(docs) && docs.length > 0 ? docs : defaultDocs;

  const handleClick = (doc) => {
    if (doc.url && doc.url !== "#" && typeof doc.url === "string" && doc.url.trim()) {
      const clean = doc.url.trim();
      const targetUrl =
        clean.startsWith("http://") || clean.startsWith("https://")
          ? clean
          : `https://${clean}`;
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    } else if (onOpenDoc) {
      onOpenDoc(doc);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
          <span>DOCUMENTATION & RESOURCE GALLERY</span>
        </div>
        <span className="text-[10px] font-mono text-[#8b949e]">
          Click card to open resource
        </span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((doc) => {
          const isSuccess = doc.statusType === "success";
          const hasUrl = Boolean(doc.url && doc.url !== "#");

          return (
            <div
              key={doc.id}
              onClick={() => handleClick(doc)}
              className="flex items-center justify-between p-4 rounded-xl bg-[#121418] hover:bg-[#161920] border border-[#232730] hover:border-[#384152] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Icon Tile */}
                <div className="w-10 h-10 rounded-lg bg-[#1a1e26] border border-[#2b3240] flex items-center justify-center shrink-0 group-hover:border-[#ADC6FF]/40 transition-colors">
                  {doc.icon || <FiFileText className="text-base text-white" />}
                </div>

                {/* Title & Status */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white truncate group-hover:text-[#ADC6FF] transition-colors">
                      {doc.title}
                    </span>
                    {hasUrl && (
                      <FiExternalLink className="text-[10px] text-[#8b949e] group-hover:text-[#ADC6FF] transition-colors shrink-0" />
                    )}
                  </div>

                  {doc.subtitle && (
                    <span className="text-[11px] font-mono text-[#8b949e] truncate mt-0.5">
                      {doc.subtitle}
                    </span>
                  )}

                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px]">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSuccess
                          ? "bg-[#10B981] shadow-[0_0_6px_#10B981]"
                          : "bg-[#FEB685] shadow-[0_0_6px_#FEB685]"
                      }`}
                    />
                    <span
                      className={
                        isSuccess ? "text-[#10B981]" : "text-[#FEB685]"
                      }
                    >
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
