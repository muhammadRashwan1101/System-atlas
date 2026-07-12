import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdDomainAdd } from "react-icons/md";

export default function WorkspaceForm() {
  return (
    <div className="flex flex-col w-full h-full p-5 ps-30 ">
      <div className="w-2/3 h-full">
        <div className="flex flex-col mb-8 gap-3">
          <div className="flex items-center gap-3">
            <MdDomainAdd className="w-7 h-7 text-(--primary)" />
            <h2 className="text-3xl font-bold text-white text-shadow-[0_0px_18px_rgba(138,175,207,0.5)]">
              Create Workspace
            </h2>
          </div>
          <p className="text-(--text)">
            Create an organizational boundary for architecture governance and
            ownership.
          </p>
        </div>
        <form className="flex flex-col gap-8 w-full">
          <div className="flex flex-col gap-8">
            <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
              0.1 Workspace Information
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="workspaceName"
              className="text-(--text) font-(family-name:--labels) uppercase text-[10px]"
            >
              Workspace Name
            </label>
            <input
              type="text"
              id="workspaceName"
              name="workspaceName"
              placeholder="e.g. Fintech Division"
              className="p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg) transform ease-in-out duration-200 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] "
            />
          </div>
          <div className="flex flex-col gap-4">
            <label
              htmlFor="workspaceDescription"
              className="text-(--text) font-(family-name:--labels) uppercase text-[10px]"
            >
              Description
            </label>
            <textarea
              id="workspaceDescription"
              name="description"
              placeholder="Describe the purpose and scope of this boundary..."
              className="p-3 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg) transform ease-in-out duration-200 resize-none focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]"
              rows={4}
            ></textarea>
          </div>
          <div className="flex flex-col gap-4 mt-10">
            <div className="flex flex-col gap-8">
              <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
                0.2 Workspace Owner
              </h2>
              <p className="text-xs text-(--text)">
                The selected owner will receive workspace administration
                privileges.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                id="search"
                name="search"
                placeholder="Search Users..."
                className="relative p-3 ps-10 border border-(--border) rounded-lg bg-(--secondary-bg) text-(--text) focus:outline-none focus:border-(--main-bg) transform ease-in-out duration-200 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)]"
              />
              <HiMagnifyingGlass className="relative -top-11.5 left-3 w-4 h-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <h2 className="font-(family-name:--labels) uppercase text-(--primary) text-sm">
              0.2 Workspace Summary Preview
            </h2>
            <ul className="grid grid-cols-2 gap-10">
              <li className="flex items-center gap-2">
                <FaRegCircleCheck className="text-(--primary)" />
                <h3 className="font-(family-name:--labels) text-(--text) text-sm">
                  {" "}
                  Projects
                </h3>
              </li>
              <li className="flex items-center gap-2">
                <FaRegCircleCheck className="text-(--primary)" />
                <h3 className="font-(family-name:--labels) text-(--text) text-sm">
                  {" "}
                  Teams
                </h3>
              </li>
              <li className="flex items-center gap-2">
                <FaRegCircleCheck className="text-(--primary)" />
                <h3 className="font-(family-name:--labels) text-(--text) text-sm">
                  {" "}
                  Components
                </h3>
              </li>
              <li className="flex items-center gap-2">
                <FaRegCircleCheck className="text-(--primary)" />
                <h3 className="font-(family-name:--labels) text-(--text) text-sm">
                  {" "}
                  Relationships
                </h3>
              </li>
            </ul>
            <p className="text-(--border) italic text-sm">
              Assets will appear after workspace creation
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
