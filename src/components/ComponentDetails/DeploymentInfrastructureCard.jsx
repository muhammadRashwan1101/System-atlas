import { FiLayers, FiGitBranch, FiExternalLink } from "react-icons/fi";
import { AiOutlineCloud } from "react-icons/ai";

export default function DeploymentInfrastructureCard({ deployment = {} }) {
  const {
    cloudProvider = "AWS (us-east-1)",
    clusterNamespace = "prod-blue / recs",
    repository = "atlas/svc-rec",
    cicdPipeline = "GitHub Actions",
  } = deployment;

  const isRepoUrl =
    typeof repository === "string" &&
    (repository.startsWith("http") || repository.startsWith("git@") || repository.includes("github.com"));

  const isCicdUrl =
    typeof cicdPipeline === "string" && cicdPipeline.startsWith("http");

  return (
    <div className="flex flex-col bg-[#121418] border border-[#232730] rounded-xl p-6 gap-4">
      {/* Header */}
      <div className="flex items-center gap-2.5 text-xs font-mono font-semibold tracking-wider text-[#ADC6FF] uppercase">
        <AiOutlineCloud className="text-sm" />
        <span>DEPLOYMENT & INFRASTRUCTURE</span>
      </div>

      {/* 4-Column Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 text-xs">
        {/* Cloud Provider */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            CLOUD PROVIDER
          </span>
          <span className="font-mono text-white text-xs">{cloudProvider}</span>
        </div>

        {/* Cluster / NS */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            CLUSTER / NS
          </span>
          <span className="font-mono text-white text-xs">{clusterNamespace}</span>
        </div>

        {/* Repository */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            REPOSITORY
          </span>
          {isRepoUrl ? (
            <a
              href={repository.startsWith("http") ? repository : `https://${repository}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[#ADC6FF] hover:underline text-xs inline-flex items-center gap-1 truncate"
            >
              <span className="truncate">{repository}</span>
              <FiExternalLink className="text-[10px] shrink-0" />
            </a>
          ) : (
            <span className="font-mono text-white text-xs truncate">
              {repository}
            </span>
          )}
        </div>

        {/* CI/CD Pipeline */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#8b949e]">
            CI/CD PIPELINE
          </span>
          {isCicdUrl ? (
            <a
              href={cicdPipeline}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[#ADC6FF] hover:underline text-xs inline-flex items-center gap-1 truncate"
            >
              <span className="truncate">{cicdPipeline}</span>
              <FiExternalLink className="text-[10px] shrink-0" />
            </a>
          ) : (
            <span className="font-mono text-white text-xs truncate">
              {cicdPipeline}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
