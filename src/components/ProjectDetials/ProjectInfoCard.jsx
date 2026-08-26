import React from "react";

export default function ProjectInfoCard({ info = {} }) {
  // عدم عرض الكارت إذا كانت جميع الحقول فارغة
  const hasInfo = info.businessDomain || info.businessOwner || info.productManager || info.archVersion;

  if (!hasInfo) return null;

  return (
    <div className="bg-[#0e1017] border border-slate-800/80 rounded-2xl p-5 space-y-3 font-mono w-full">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        PROJECT INFORMATION
      </div>

      <div className="space-y-3 text-xs">
        {info.businessDomain && (
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">BUSINESS DOMAIN</span>
            <span className="text-slate-100 font-bold">{info.businessDomain}</span>
          </div>
        )}
        {info.businessOwner && (
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">BUSINESS OWNER</span>
            <span className="text-slate-100 font-bold">{info.businessOwner}</span>
          </div>
        )}
        {info.productManager && (
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">PRODUCT MANAGER</span>
            <span className="text-slate-100 font-bold">{info.productManager}</span>
          </div>
        )}
        {info.archVersion && (
          <div>
            <span className="text-slate-400 block uppercase text-[10px]">ARCH VERSION</span>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {info.archVersion}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}