import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiCheckCircle,
  FiEdit3,
  FiBox,
  FiCpu,
  FiUsers,
  FiFileText,
  FiShare2,
  FiExternalLink,
  FiArrowRight,
  FiShield,
  FiTerminal,
  FiLayers,
} from "react-icons/fi";
import api from "../../../api/axios";
import useWizard from "../../../context/WizardContext";

export default function WizardReview() {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const { data, wizardId, setCurrentStep, setStatus } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [createdResult, setCreatedResult] = useState(null);

  const { handleSubmit } = useForm();

  // Canonical state slices from WizardProvider
  const basicInfo = data?.basicInfo || {};
  const techList = Array.isArray(data?.techStack?.technologies)
    ? data.techStack.technologies
    : typeof basicInfo.techStack === "string" && basicInfo.techStack.trim()
    ? basicInfo.techStack.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const ownership = data?.ownership || {};
  const documentation = data?.documentation || {};
  const relationships = Array.isArray(data?.relationships)
    ? data.relationships
    : [];

  const onSubmit = async () => {
    if (isSubmitting) return;

    if (!wizardId) {
      toast.error("Wizard session not found. Please start from Step 1.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      confirmation: true,
    };

    try {
      const endpoint = `/projects/${projectId}/wizard/${wizardId}`;
      let response;
      try {
        response = await api.patch(endpoint, payload);
      } catch (patchErr) {
        if (
          patchErr.response?.status === 404 ||
          patchErr.response?.status === 405
        ) {
          try {
            response = await api.patch(
              `/projects/${projectId}/components/${wizardId}`,
              payload
            );
          } catch {
            throw patchErr;
          }
        } else {
          throw patchErr;
        }
      }

      toast.success(
        response.data?.msg ||
          response.data?.message ||
          "Component saved successfully!"
      );

      setStatus("finished");
      setCreatedResult(response.data);
    } catch (err) {
      const message =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to finalize component creation. Please verify previous steps.";

      const displayMessage = Array.isArray(message)
        ? message.join(", ")
        : typeof message === "object"
        ? JSON.stringify(message)
        : message;

      setSubmitError(displayMessage);
      toast.error(displayMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Completion view (shown ONLY after backend confirms successful creation)
  if (createdResult) {
    return (
      <div className="bg-[#131519] border border-emerald-500/40 rounded-xl p-8 w-full shadow-2xl flex flex-col items-center text-center gap-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 text-3xl shadow-[0_0_20px_rgba(52,211,153,0.4)] animate-bounce">
          <FiCheckCircle />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="font-(family-name:--headers) text-2xl font-bold text-white">
            Component Created Successfully!
          </h2>
          <p className="text-xs text-(--text)/70 font-light max-w-md leading-relaxed">
            <span className="text-white font-semibold">
              {basicInfo.name || "Component"}
            </span>{" "}
            has been registered and integrated into the System Atlas architecture graph.
          </p>
          {createdResult.componentId && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded bg-[#0D0E11] border border-(--border)/40 text-xs font-mono text-sky-300">
              <span className="text-(--text)/50">ID:</span> {createdResult.componentId}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-4 w-full justify-center">
          <Link
            to={
              workspaceId && projectId
                ? `/workspaces/${workspaceId}/projects/${projectId}/graph`
                : "/app"
            }
            className="flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs rounded-lg transition-all duration-200 shadow-md shadow-sky-500/20"
          >
            <FiShare2 /> Explore Architecture Graph
          </Link>
          <button
            type="button"
            onClick={() =>
              navigate(
                workspaceId && projectId
                  ? `/workspaces/${workspaceId}/projects/${projectId}/graph`
                  : "/app"
              )
            }
            className="flex items-center gap-2 px-5 py-2.5 bg-[#0D0E11] hover:bg-white/5 text-white border border-(--border)/40 font-medium text-xs rounded-lg transition-colors"
          >
            View Live Graph
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#131519] border border-[#44474F30] rounded-xl p-6 w-full shadow-lg">
      <form
        id="wizard-step-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 w-full"
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-(family-name:--headers) text-xl font-semibold text-white">
              Final Architecture Review
            </h2>
            <span className="px-2.5 py-1 text-[11px] font-(family-name:--labels) uppercase tracking-wider rounded-md border border-sky-400/30 bg-sky-500/10 text-sky-300">
              Read-Only Review
            </span>
          </div>
          <p className="text-xs text-(--text)/70 font-light leading-relaxed">
            Review all component specifications before finalizing node creation.
            Click the edit icon on any section to adjust information.
          </p>
        </div>

        {submitError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 leading-relaxed">
            {submitError}
          </div>
        )}

        <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-1">
          {/* 1. Basic Information */}
          <div className="p-4 rounded-xl bg-[#0D0E11] border border-(--border)/40 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-(--border)/30 pb-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <FiBox className="text-sky-400" /> Basic Component Identity
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep("basicInfo")}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
              >
                <FiEdit3 /> Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-(--text)/50 text-[11px] uppercase tracking-wider block font-mono">
                  Name
                </span>
                <span className="font-semibold text-white mt-0.5 block">
                  {basicInfo.name || basicInfo.componentName || "Untitled"}
                </span>
              </div>
              <div>
                <span className="text-(--text)/50 text-[11px] uppercase tracking-wider block font-mono">
                  Component Type
                </span>
                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-[11px]">
                  {basicInfo.type || basicInfo.componentType || "Unassigned"}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-(--text)/50 text-[11px] uppercase tracking-wider block font-mono">
                  Description
                </span>
                <p className="text-(--text)/80 mt-0.5 leading-relaxed text-xs">
                  {basicInfo.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Technology Stack */}
          <div className="p-4 rounded-xl bg-[#0D0E11] border border-(--border)/40 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-(--border)/30 pb-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <FiCpu className="text-sky-400" /> Technology Stack
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep("techStack")}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
              >
                <FiEdit3 /> Edit
              </button>
            </div>

            {techList.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {techList.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded bg-sky-500/15 border border-sky-400/40 text-white text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-(--text)/50 italic">
                No technologies assigned.
              </span>
            )}
          </div>

          {/* 3. Ownership & Environment */}
          <div className="p-4 rounded-xl bg-[#0D0E11] border border-(--border)/40 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-(--border)/30 pb-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <FiUsers className="text-sky-400" /> Ownership & Governance
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep("ownership")}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
              >
                <FiEdit3 /> Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-(--text)/50 text-[11px] uppercase tracking-wider block font-mono">
                  Owner Team / Reference
                </span>
                <span className="font-semibold text-white mt-0.5 block">
                  {basicInfo.ownerTeam ||
                    ownership.ownerRefCode ||
                    "Unassigned Team"}
                </span>
              </div>

              <div>
                <span className="text-(--text)/50 text-[11px] uppercase tracking-wider block font-mono">
                  Target Environment
                </span>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 font-mono text-[11px] uppercase">
                  <FiTerminal className="text-[10px]" />
                  {ownership.environment || basicInfo.environment || "development"}
                </span>
              </div>

              <div>
                <span className="text-(--text)/50 text-[11px] uppercase tracking-wider block font-mono">
                  Technical Lead
                </span>
                <span className="text-white mt-0.5 block">
                  {basicInfo.technicalLead || "Unassigned"}
                </span>
              </div>

              <div>
                <span className="text-(--text)/50 text-[11px] uppercase tracking-wider block font-mono">
                  Maintainers
                </span>
                <span className="text-white mt-0.5 inline-flex items-center gap-1">
                  <FiShield className="text-sky-400 text-xs" />
                  {Array.isArray(ownership.maintainers)
                    ? `${ownership.maintainers.length} Assigned Member(s)`
                    : "0 Assigned Members"}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Documentation & Links */}
          <div className="p-4 rounded-xl bg-[#0D0E11] border border-(--border)/40 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-(--border)/30 pb-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <FiFileText className="text-sky-400" /> Documentation & Resources
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep("documentation")}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
              >
                <FiEdit3 /> Edit
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div>
                <span className="text-(--text)/50 text-[11px] uppercase font-mono block">
                  Repository
                </span>
                {documentation.repoURL ? (
                  <a
                    href={documentation.repoURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline inline-flex items-center gap-1 truncate max-w-xs"
                  >
                    {documentation.repoURL} <FiExternalLink className="text-[10px]" />
                  </a>
                ) : (
                  <span className="text-(--text)/40 italic">Not provided</span>
                )}
              </div>

              <div>
                <span className="text-(--text)/50 text-[11px] uppercase font-mono block">
                  Documentation
                </span>
                {documentation.docsURL ? (
                  <a
                    href={documentation.docsURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline inline-flex items-center gap-1 truncate max-w-xs"
                  >
                    {documentation.docsURL} <FiExternalLink className="text-[10px]" />
                  </a>
                ) : (
                  <span className="text-(--text)/40 italic">Not provided</span>
                )}
              </div>

              <div>
                <span className="text-(--text)/50 text-[11px] uppercase font-mono block">
                  Observability
                </span>
                {documentation.monitorURL ? (
                  <a
                    href={documentation.monitorURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline inline-flex items-center gap-1 truncate max-w-xs"
                  >
                    {documentation.monitorURL} <FiExternalLink className="text-[10px]" />
                  </a>
                ) : (
                  <span className="text-(--text)/40 italic">Not provided</span>
                )}
              </div>

              <div>
                <span className="text-(--text)/50 text-[11px] uppercase font-mono block">
                  Deployment Endpoint
                </span>
                {documentation.deploymentURL ? (
                  <a
                    href={documentation.deploymentURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:underline inline-flex items-center gap-1 truncate max-w-xs"
                  >
                    {documentation.deploymentURL} <FiExternalLink className="text-[10px]" />
                  </a>
                ) : (
                  <span className="text-(--text)/40 italic">Not provided</span>
                )}
              </div>

              {Array.isArray(documentation.tags) && documentation.tags.length > 0 && (
                <div className="col-span-2 pt-1">
                  <span className="text-(--text)/50 text-[11px] uppercase font-mono block mb-1">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {documentation.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-white/5 border border-(--border)/30 text-[11px] text-(--text)"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Architectural Relationships */}
          <div className="p-4 rounded-xl bg-[#0D0E11] border border-(--border)/40 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-(--border)/30 pb-2.5">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <FiShare2 className="text-sky-400" /> Graph Connections ({relationships.length})
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep("relationships")}
                className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
              >
                <FiEdit3 /> Edit
              </button>
            </div>

            {relationships.length > 0 ? (
              <div className="flex flex-col gap-2">
                {relationships.map((rel, idx) => (
                  <div
                    key={`${rel.targetId}-${idx}`}
                    className="p-2.5 rounded-lg bg-[#131519] border border-(--border)/30 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sky-300 font-semibold text-[11px]">
                        {basicInfo.name || "This Node"}
                      </span>
                      <FiArrowRight className="text-sky-400 text-xs" />
                      <span className="px-1.5 py-0.5 rounded bg-white/5 border border-(--border)/30 text-[10px] text-white">
                        {rel.type}
                      </span>
                      <FiArrowRight className="text-sky-400 text-xs" />
                      <span className="font-semibold text-white">
                        {rel.targetName || "Target Node"}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-400/30">
                      {rel.protocol}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-(--text)/50 italic">
                <FiLayers className="text-sm" /> No initial relationships configured (isolated component).
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
