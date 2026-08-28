import React from "react";
import { FiServer, FiShield, FiShare2, FiDatabase, FiCpu, FiLayers } from "react-icons/fi";

export default function OwnershipRegistry({ components = [] }) {
  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "cloud-service":
      case "cluster":
        return <FiServer className="text-emerald-400 text-lg" />;
      case "security":
      case "auth":
      case "backend":
        return <FiShield className="text-emerald-400 text-lg" />;
      case "api-gateway":
      case "queue":
        return <FiShare2 className="text-emerald-400 text-lg" />;
      case "database":
      case "cache":
        return <FiDatabase className="text-emerald-400 text-lg" />;
      default:
        return <FiLayers className="text-emerald-400 text-lg" />;
    }
  };

  const defaultRegistry = [
    {
      _id: "c1",
      name: "Kubernetes Cluster (Production)",
      codeId: "CLS-PRD-001",
      type: "cloud-service",
      version: "v1.28.4",
    },
    {
      _id: "c2",
      name: "Auth Service",
      codeId: "SVC-AUTH-04",
      type: "auth",
      version: "OAuth2.0 Compliant",
    },
    {
      _id: "c3",
      name: "API Gateway",
      codeId: "SVC-GWY-09",
      type: "api-gateway",
      version: "Kong/Ingress",
    },
    {
      _id: "c4",
      name: "Redis Cache Cluster",
      codeId: "DB-RDIS-12",
      type: "database",
      version: "Volatile Store",
    },
  ];

  const list = components && components.length > 0 ? components : defaultRegistry;

  return (
    <div className="space-y-3">
      <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
        OWNERSHIP REGISTRY
      </div>

      <div className="space-y-2.5">
        {list.map((item, index) => {
          const codeId = item.codeId || item.ownerRefCode || `SVC-${String(index + 1).padStart(2, "0")}`;
          const versionText = item.version || item.type || "Active Service";

          return (
            <div
              key={item._id || index}
              className="bg-[#0e1017] border border-slate-800/80 hover:border-slate-700/80 rounded-xl px-4 py-3 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-center shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white font-(family-name:--headers)">
                    {item.name}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-400">
                    ID: {codeId} • {versionText}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
