import { CiSquarePlus } from "react-icons/ci";
import { CgNotes } from "react-icons/cg";
import { MdInsertLink } from "react-icons/md";
import { FaClockRotateLeft } from "react-icons/fa6";

export default function Activity() {
  const architectureActivity = [
    {
      id: 1,
      icon: CiSquarePlus,
      title: "Created Component",
      highlight: "Auth Service",
      time: "2 hours ago",
      source: "Repository: atlas-auth-v2",
    },
    {
      id: 2,
      icon: MdInsertLink,
      title: "Added Relationship",
      highlight: "API Gateway → Recommendation Service",
      time: "Yesterday",
      source: "Architecture Map v1.2",
    },
    {
      id: 3,
      icon: CgNotes,
      title: "Updated Documentation",
      highlight: "Redis Cluster Failover Policy",
      time: "3 days ago",
      source: "System Atlas Wiki",
    },
  ];
  return (
    <>
      <div>
        <div className="my-11 flex items-center gap-4">
          <FaClockRotateLeft className="text-2xl" />
          <span className="text-2xl font-medium">Architecture Activity</span>
        </div>

        {architectureActivity.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.id} className="flex gap-5 my-8">
              <div className="w-12 h-12 flex items-center justify-center rounded-lg border border-[#2D303A]">
                <Icon className="text-xl text-(--tertiary)" />
              </div>

              <div>
                <h3 className="text-xl">
                  <span className="text-var((--tertiary)) font-semibold">
                    {item.title}:
                  </span>{" "}
                  {item.highlight}
                </h3>

                <p className="text-sm text-gray-400">
                  {item.time} • {item.source}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
