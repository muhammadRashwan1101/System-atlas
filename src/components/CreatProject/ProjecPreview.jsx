import React from 'react'

export default function ProjecPreview({ projectSummary }) {
    return (
        <div className="flex flex-col w-full lg:w-1/2 h-full p-4 sm:p-6 lg:p-8 shadow-[-2px_-4px_7px_rgba(0,0,0,0.6)] bg-[#131519]">
            <div className="flex flex-col items-center justify-between w-full min-h-[400px] lg:h-250 py-4 lg:py-8">
                <h2 className="font-(family-name:--labels) uppercase text-(--tertiary) text-center text-sm sm:text-base lg:text-lg tracking-wider">
                    PROJECT ARCHITECTURE
                    <br className="block lg:hidden" /> PREVIEW
                </h2>

                {/* Summary Title */}
                <div className="w-[95%] max-w-[380px] mx-auto lg:ml-auto p-4 border border-(--border2) rounded-lg overflow-hidden bg-(--main-bg) text-xs sm:text-sm font-mono mt-6 lg:mt-0 ms-50">
                    <h2 className="text-xs sm:text-sm tracking-[2px] uppercase text-(--primary) mb-2">
                        Project Summary
                    </h2>
                    <div className="flex justify-between items-center mt-3 w-full gap-4">
                        <p className="truncate">Department</p>
                        <span>
                            {projectSummary.department || "Not Selected"}
                        </span>
                    </div>

                    <div className="flex justify-between items-center mt-3 w-full gap-4">
                        <p className="truncate">Environment</p>
                        <span>
                            {projectSummary.targetEnvironment || "Not Selected"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 w-full gap-4">
                        <p>Manager</p>
                        <span>
                            {projectSummary.managerName || "Not Assigned"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mt-3 w-full gap-4">
                        <p className="truncate">Components</p>
                        <span className="text-right shrink-0">0</span>
                    </div>

                    <div className="flex justify-between items-center mt-3 w-full gap-4">
                        <p className="truncate">Relationships</p>
                        <span className="text-right shrink-0">0</span>
                    </div>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-900/30 lg:border-t-0">

                <p className="font-(family-name:--labels) text-(--border) text-[10px] sm:text-xs leading-relaxed text-center ">
                    *Architecture models are dynamically generated
                    based on project type selection. Connections
                    represent anticipated VPC traffic flows.
                </p>
            </div>
        </div>
    )
}
