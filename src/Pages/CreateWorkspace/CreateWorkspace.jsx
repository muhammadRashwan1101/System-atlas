import TopologyPreview from "../../components/CreateWorkspace/TopologyPreview";
import WorkspaceForm from "../../components/CreateWorkspace/WorkspaceForm";
import { useRef } from "react";
export default function WorkspaceCreation() {
    const formRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formRef.current) {
            formRef.current.requestSubmit();
        }
    }
    return (
        <>
            <div className="flex flex-col w-full h-screen bg-(--main-bg)">
                <div className="flex flex-1 items-center min-h-0 w-full bg-(--main-bg)">
                        <div className="flex items-start w-full h-full">
                            <WorkspaceForm  formRef={formRef}/>
                            <TopologyPreview />
                        </div>
                </div>
                <div className="flex items-center justify-between w-full py-5 border-t border-(--border)/40 ps-30 pe-20 font-(family-name:--labels) text-(--text) text-sm">
                    <button className="py-2  px-2 text-sm font-semibold rounded-lg text-[#FF8A80] uppercase hover:text-[#FF8A80]/80 hover:bg-[#FF8A8020] transform ease-in-out duration-200">Cancel</button>
                    <div className="flex gap-10">
                        <button className="px-6 py-2 text-sm font-medium text-(--text-primary) bg-(--primary) rounded-lg shadow-none  hover:bg-(--primary)/90 hover:shadow-[0px_0px_7px_rgba(173,198,255,0.6)] transform ease-in-out duration-300 uppercase" onClick={handleSubmit}>Create Workspace</button>
                    </div>
                </div>
            </div>
        </>
    )
}