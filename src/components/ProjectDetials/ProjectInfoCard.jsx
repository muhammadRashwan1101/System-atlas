import React from "react";

export default function ProjectInfoCard({ info = {} }) {
  const hasInfo = info.businessDomain || info.businessOwner || info.productManager || info.archVersion;

  if (!hasInfo) return null;

  return (
    <div className="bg-[#0e1017] border border-slate-800/80 rounded-2xl p-5 space-y-3 w-full">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-(family-name:--labels)">
        PROJECT INFORMATION
      </div>

      <div className="space-y-3 text-xs">
        {info.businessDomain && (
          <div>
            <span className="text-slate-400 block uppercase text-[10px] font-(family-name:--labels)">BUSINESS DOMAIN</span>
            <span className="text-slate-100 font-bold font-(family-name:--body-font)">{info.businessDomain}</span>
          </div>
        )}
        {info.businessOwner && (
          <div>
            <span className="text-slate-400 block uppercase text-[10px] font-(family-name:--labels)">BUSINESS OWNER</span>
            <span className="text-slate-100 font-bold font-(family-name:--body-font)">{info.businessOwner}</span>
          </div>
        )}
        {info.productManager && (
          <div>
            <span className="text-slate-400 block uppercase text-[10px] font-(family-name:--labels)">PRODUCT MANAGER</span>
            <span className="text-slate-100 font-bold font-(family-name:--body-font)">{info.productManager}</span>
          </div>
        )}
        {info.archVersion && (
          <div>
            <span className="text-slate-400 block uppercase text-[10px] font-(family-name:--labels)">ARCH VERSION</span>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold font-(family-name:--labels) bg-slate-800 text-slate-300 border border-slate-700">
              {info.archVersion}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}