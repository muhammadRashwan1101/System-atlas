import { FiMail, FiUsers } from "react-icons/fi";
import { HiUserGroup } from "react-icons/hi2";
import { FaSlack } from "react-icons/fa";
import profilePic from "../../assets/profile-pic/profliePic.png";

export default function OwnershipCard({ ownership = {} }) {
  const {
    teamName = "Growth Team",
    vertical = "Data & Platform Vertical",
    slackChannel = "#growth-eng",
    leads = [
      {
        name: "Sarah Chen",
        role: "TECH LEAD",
        email: "sarah.chen@atlas.internal",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      },
      {
        name: "Alex Rivera",
        role: "SRE ARCHITECT",
        email: "alex.rivera@atlas.internal",
        avatar: profilePic,
      },
    ],
    assignedDevelopersCount = 4,
  } = ownership;

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
          <HiUserGroup className="text-sm" />
          <span>OWNERSHIP</span>
        </div>
      </div>

      {/* Team Details & Slack Tag */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-white text-base leading-snug">
            {teamName}
          </h3>
          <p className="text-xs text-[#8b949e]">{vertical}</p>
        </div>

        {slackChannel && (
          <a
            href={`slack://channel?team=atlas&id=${slackChannel.replace("#", "")}`}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#3b194f] hover:bg-[#4d2067] border border-[#6b2c8e]/60 text-white font-mono text-[11px] font-medium transition-colors cursor-pointer"
          >
            <FaSlack className="text-[10px] text-pink-300" />
            <span>{slackChannel}</span>
          </a>
        )}
      </div>

      {/* Key Contacts / Leads */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[#232730]/70">
        {leads.map((person, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-9 h-9 rounded-full object-cover border border-[#2B3240]"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white">
                  {person.name}
                </span>
                <span className="text-[9px] font-mono uppercase text-[#8b949e] tracking-wider">
                  {person.role}
                </span>
              </div>
            </div>

            <a
              href={`mailto:${person.email}`}
              title={`Email ${person.name}`}
              className="p-1.5 text-[#8b949e] hover:text-white transition-colors"
            >
              <FiMail className="text-sm" />
            </a>
          </div>
        ))}
      </div>

      {/* Assigned Developers Counter */}
      <div className="pt-2 border-t border-[#232730]/70">
        <span className="text-[10px] font-mono uppercase text-[#8b949e] block">
          ASSIGNED DEVELOPERS
        </span>
        <span className="text-xs font-medium text-white mt-0.5 block">
          {assignedDevelopersCount} Active Contributors
        </span>
      </div>
    </div>
  );
}
