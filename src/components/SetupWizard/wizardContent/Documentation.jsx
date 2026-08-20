import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiGithub,
  FiBookOpen,
  FiActivity,
  FiGlobe,
  FiTag,
  FiPlus,
  FiX,
} from "react-icons/fi";
import api from "../../../api/axios";
import useWizard from "../../../context/WizardContext";

export default function Documentation() {
  const { projectId } = useParams();
  const { data, updateStepData, setCurrentStep, wizardId } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [tagInput, setTagInput] = useState("");

  const initialDocs = data?.documentation || {};

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      repoURL: initialDocs.repoURL || "",
      docsURL: initialDocs.docsURL || "",
      monitorURL: initialDocs.monitorURL || "",
      deploymentURL: initialDocs.deploymentURL || "",
      tags: Array.isArray(initialDocs.tags) ? initialDocs.tags : [],
    },
  });

  const watchedRepo = useWatch({ control, name: "repoURL" });
  const watchedDocs = useWatch({ control, name: "docsURL" });
  const watchedMonitor = useWatch({ control, name: "monitorURL" });
  const watchedDeployment = useWatch({ control, name: "deploymentURL" });
  const rawTags = useWatch({ control, name: "tags" });
  const watchedTags = useMemo(
    () => (Array.isArray(rawTags) ? rawTags : []),
    [rawTags]
  );

  // Keep state live in wizard context to preserve entered data
  useEffect(() => {
    updateStepData("documentation", {
      repoURL: watchedRepo || "",
      docsURL: watchedDocs || "",
      monitorURL: watchedMonitor || "",
      deploymentURL: watchedDeployment || "",
      tags: watchedTags,
    });
  }, [
    watchedRepo,
    watchedDocs,
    watchedMonitor,
    watchedDeployment,
    watchedTags,
    updateStepData,
  ]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;

    if (!watchedTags.includes(trimmed)) {
      setValue("tags", [...watchedTags, trimmed], { shouldValidate: true });
    }
    setTagInput("");
  };

  const handleRemoveTag = (tagToRemove) => {
    const updated = watchedTags.filter((t) => t !== tagToRemove);
    setValue("tags", updated, { shouldValidate: true });
  };

  const onSubmit = async (formData) => {
    if (isSubmitting) return;

    if (!wizardId) {
      toast.error("Wizard session not found. Please start from Step 1.");
      return;
    }

    // Clean URL fields (empty strings to null or omit)
    const cleanRepo = formData.repoURL?.trim() || null;
    const cleanDocs = formData.docsURL?.trim() || null;
    const cleanMonitor = formData.monitorURL?.trim() || null;
    const cleanDeployment = formData.deploymentURL?.trim() || null;
    const cleanTags = Array.isArray(formData.tags)
      ? formData.tags.map((t) => t.trim()).filter(Boolean)
      : [];

    // Backend requires documentation object to not be empty
    const hasAtLeastOne =
      cleanRepo ||
      cleanDocs ||
      cleanMonitor ||
      cleanDeployment ||
      cleanTags.length > 0;

    if (!hasAtLeastOne) {
      const emptyMsg =
        "Please provide at least one documentation URL, repository link, or service tag.";
      setSubmitError(emptyMsg);
      toast.error(emptyMsg);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      repoURL: cleanRepo,
      docsURL: cleanDocs,
      monitorURL: cleanMonitor,
      deploymentURL: cleanDeployment,
      tags: cleanTags,
    };

    try {
      const endpoint = `/projects/${projectId}/wizard/${wizardId}`;
      const response = await api.patch(endpoint, payload);

      toast.success(
        response.data?.msg ||
          response.data?.message ||
          "Documentation saved successfully"
      );

      const responseData =
        response.data?.currentWizard ||
        response.data?.wizard ||
        response.data;
      const nextStep =
        responseData?.currentStep || response.data?.nextStep || "relationships";

      updateStepData("documentation", payload);

      // Transition to backend-returned currentStep
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    } catch (err) {
      const message =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save documentation. Please try again.";

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

  return (
    <div className="bg-[#131519] border border-[#44474F30] rounded-xl p-6 w-full shadow-lg">
      <form
        id="wizard-step-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 w-full"
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-(family-name:--headers) text-xl font-semibold text-white">
              Documentation & Resources
            </h2>
            <span className="px-2.5 py-1 text-[11px] font-(family-name:--labels) uppercase tracking-wider rounded-md border border-sky-400/30 bg-sky-500/10 text-sky-300">
              Links & Metadata
            </span>
          </div>
          <p className="text-xs text-(--text)/70 font-light leading-relaxed">
            Attach source code repositories, technical documentation, observability
            dashboards, and classification tags to this component.
          </p>
        </div>

        {submitError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 leading-relaxed">
            {submitError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Repository URL */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="repoURL"
              className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider"
            >
              <FiGithub className="text-base" />
              Repository URL
            </label>
            <input
              type="url"
              id="repoURL"
              placeholder="https://github.com/org/repo"
              {...register("repoURL", {
                pattern: {
                  value:
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "Please enter a valid URL (e.g. https://...)",
                },
              })}
              className="p-2.5 rounded-lg bg-[#0D0E11] text-white border border-(--border)/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:border-sky-400 transition-all duration-200 text-xs"
            />
            {errors.repoURL && (
              <p className="text-red-400 text-xs">{errors.repoURL.message}</p>
            )}
          </div>

          {/* Documentation URL */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="docsURL"
              className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider"
            >
              <FiBookOpen className="text-base" />
              Documentation URL
            </label>
            <input
              type="url"
              id="docsURL"
              placeholder="https://docs.company.com/service"
              {...register("docsURL", {
                pattern: {
                  value:
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "Please enter a valid URL (e.g. https://...)",
                },
              })}
              className="p-2.5 rounded-lg bg-[#0D0E11] text-white border border-(--border)/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:border-sky-400 transition-all duration-200 text-xs"
            />
            {errors.docsURL && (
              <p className="text-red-400 text-xs">{errors.docsURL.message}</p>
            )}
          </div>

          {/* Monitoring Dashboard URL */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="monitorURL"
              className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider"
            >
              <FiActivity className="text-base" />
              Monitoring / Observability URL
            </label>
            <input
              type="url"
              id="monitorURL"
              placeholder="https://grafana.internal/dashboard"
              {...register("monitorURL", {
                pattern: {
                  value:
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "Please enter a valid URL (e.g. https://...)",
                },
              })}
              className="p-2.5 rounded-lg bg-[#0D0E11] text-white border border-(--border)/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:border-sky-400 transition-all duration-200 text-xs"
            />
            {errors.monitorURL && (
              <p className="text-red-400 text-xs">{errors.monitorURL.message}</p>
            )}
          </div>

          {/* Live Deployment URL */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="deploymentURL"
              className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider"
            >
              <FiGlobe className="text-base" />
              Deployment / Live Endpoint URL
            </label>
            <input
              type="url"
              id="deploymentURL"
              placeholder="https://api.company.com/auth"
              {...register("deploymentURL", {
                pattern: {
                  value:
                    /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                  message: "Please enter a valid URL (e.g. https://...)",
                },
              })}
              className="p-2.5 rounded-lg bg-[#0D0E11] text-white border border-(--border)/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:border-sky-400 transition-all duration-200 text-xs"
            />
            {errors.deploymentURL && (
              <p className="text-red-400 text-xs">
                {errors.deploymentURL.message}
              </p>
            )}
          </div>
        </div>

        {/* Tags & Classifications */}
        <div className="flex flex-col gap-2 pt-1 border-t border-(--border)/30">
          <label
            htmlFor="tagInput"
            className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider"
          >
            <FiTag className="text-base" />
            Tags & Classifications ({watchedTags.length})
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              id="tagInput"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
              placeholder="Add tags (e.g. core-service, auth, tier-1, pci-dss) and press Enter"
              className="flex-1 p-2.5 rounded-lg bg-[#0D0E11] text-white border border-(--border)/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:border-sky-400 transition-all duration-200 text-xs"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FiPlus /> Add
            </button>
          </div>

          {watchedTags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 p-2.5 rounded-lg bg-[#0D0E11] border border-(--border)/40 min-h-[44px] items-center">
              {watchedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs bg-sky-500/15 border border-sky-400/50 text-white animate-fadeIn"
                >
                  <FiTag className="text-sky-300 text-[10px]" />
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="p-0.5 rounded hover:bg-sky-400/20 text-sky-200 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <FiX className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-[#0D0E11] border border-dashed border-(--border)/40 text-center text-xs text-(--text)/50 font-light">
              No tags added. Tags help filter and categorize nodes in the System Atlas graph.
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
