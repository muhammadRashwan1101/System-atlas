import { useState } from "react";

export default function ImpactTopologyCanvas({
  targetComponent = {
    id: "svc-rec-001",
    name: "Recommendation Service",
    displayId: "ID: SVC-REC-001",
  },
  level1Nodes = [
    {
      id: "auth-svc",
      name: "Auth Service",
      impactType: "CRITICAL IMPACT",
      isCritical: true,
      action: "AUTHENTICATES",
    },
    {
      id: "api-gw",
      name: "API Gateway",
      impactType: "CRITICAL IMPACT",
      isCritical: true,
      action: "REGISTERED AT",
    },
    {
      id: "mobile-app",
      name: "Mobile App",
      impactType: "INDIRECT IMPACT",
      isCritical: false,
      action: "CONSUMES",
    },
  ],
  level2Nodes = [
    {
      id: "redis",
      name: "Redis Cache",
      action: "READS FROM",
    },
    {
      id: "rabbitmq",
      name: "RabbitMQ",
      action: "PUBLISHES TO",
    },
    {
      id: "postgres",
      name: "PostgreSQL",
      action: "WRITES TO",
    },
  ],
  isFailureActive = false,
  onSelectNode = () => {},
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(targetComponent.id);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-8 bg-[#08090C] relative overflow-auto select-none min-h-[700px]">
      {/* Background Subtle Dot Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f242e_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Main Dependency Tree */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl gap-10 my-auto">
        {/* 1. Root Target Component */}
        <div className="flex flex-col items-center">
          <div
            onClick={() => {
              setSelectedNodeId(targetComponent.id);
              onSelectNode(targetComponent);
            }}
            className={`flex flex-col items-center justify-center w-80 p-6 rounded-xl bg-[#121418] border transition-all duration-300 cursor-pointer shadow-2xl ${
              isFailureActive
                ? "border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)] animate-pulse"
                : selectedNodeId === targetComponent.id
                ? "border-[#ADC6FF] shadow-[0_0_25px_rgba(173,198,255,0.15)]"
                : "border-[#2B3240] hover:border-[#384152]"
            }`}
          >
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#8b949e] font-semibold">
              TARGET COMPONENT
            </span>
            <h2 className="text-xl font-bold text-white mt-1 text-center font-['Geist',sans-serif]">
              {targetComponent.name}
            </h2>
            <span className="text-[11px] font-mono text-[#8b949e] mt-0.5">
              {targetComponent.displayId}
            </span>
          </div>

          {/* Root Connection Node Indicator */}
          <div className="flex flex-col items-center mt-2">
            <div className="w-px h-6 bg-[#2B3240]" />
            <span className="px-2 py-0.5 rounded bg-[#161920] border border-[#2B3240] text-[9px] font-mono uppercase tracking-wider text-[#8b949e]">
              DEPENDENCY ROOT
            </span>
            <div className="w-px h-6 bg-[#2B3240]" />
          </div>
        </div>

        {/* Tree Branching Connector Horizontal Line */}
        <div className="relative w-full max-w-2xl flex items-center justify-center -mt-6">
          <div className="w-full h-px bg-[#2B3240]" />
        </div>

        {/* 2. Level 1 Impact Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl -mt-6">
          {level1Nodes.map((node) => {
            const isCritical = node.isCritical || isFailureActive;

            return (
              <div key={node.id} className="flex flex-col items-center">
                {/* Vertical Drop Line */}
                <div className="w-px h-6 bg-[#2B3240]" />

                {/* Node Box */}
                <div
                  onClick={() => {
                    setSelectedNodeId(node.id);
                    onSelectNode(node);
                  }}
                  className={`flex flex-col items-center justify-center w-full p-4 rounded-xl bg-[#121418] border transition-all duration-200 cursor-pointer shadow-lg ${
                    isCritical
                      ? "border-[#FF8A7A]/70 shadow-[0_0_20px_rgba(255,138,122,0.15)]"
                      : "border-[#232730] hover:border-[#384152]"
                  }`}
                >
                  <span
                    className={`text-[9px] font-mono uppercase tracking-wider font-semibold ${
                      isCritical ? "text-[#FF8A7A]" : "text-[#8b949e]"
                    }`}
                  >
                    {node.impactType}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {node.name}
                  </h3>
                  <span className="text-[10px] font-mono text-[#8b949e] mt-2 uppercase tracking-wider">
                    {node.action}
                  </span>
                </div>

                {/* Vertical Line to Infrastructure */}
                <div className="w-px h-6 bg-[#2B3240]" />
              </div>
            );
          })}
        </div>

        {/* 3. Level 2 Downstream Infrastructure / DB Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl -mt-6">
          {level2Nodes.map((infra) => (
            <div
              key={infra.id}
              onClick={() => {
                setSelectedNodeId(infra.id);
                onSelectNode(infra);
              }}
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#121418] border border-[#232730] hover:border-[#384152] transition-colors cursor-pointer"
            >
              <h4 className="text-xs font-semibold text-white">{infra.name}</h4>
              <span className="text-[9px] font-mono text-[#8b949e] mt-1 uppercase tracking-wider">
                {infra.action}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom marker: END OF DEPENDENCY CHAIN */}
      <div className="relative z-10 pt-8 pb-2">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#44474F]">
          END OF DEPENDENCY CHAIN
        </span>
      </div>
    </div>
  );
}
