import { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FiSearch, FiX, FiCheck, FiCpu, FiLayers, FiPlus } from "react-icons/fi";
import { BiCodeAlt } from "react-icons/bi";
import api from "../../../api/axios";
import useWizard from "../../../context/WizardContext";
import {
  getTechnologiesForType,
  getAllTechnologies,
} from "../../../constants/technologies";

export default function TechStack() {
  const { projectId } = useParams();
  const { data, updateStepData, setCurrentStep, wizardId } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const basicInfo = data?.basicInfo || {};
  const componentType = basicInfo.type || basicInfo.componentType || "";

  // Initial selected technologies from context or empty array
  const initialTechs = useMemo(() => {
    const existing = data?.techStack?.technologies;
    if (Array.isArray(existing) && existing.length > 0) {
      return existing;
    }
    if (typeof basicInfo.techStack === "string" && basicInfo.techStack.trim()) {
      return basicInfo.techStack.split(",").map((s) => s.trim()).filter(Boolean);
    }
    return [];
  }, [data?.techStack?.technologies, basicInfo.techStack]);

  const {
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      technologies: initialTechs,
    },
  });

  const hasInitializedRef = useState(false);

  useEffect(() => {
    if (!hasInitializedRef[0] && initialTechs && initialTechs.length > 0) {
      hasInitializedRef[1](true);
      reset({ technologies: initialTechs });
    }
  }, [initialTechs, reset, hasInitializedRef]);

  const watchedTechnologies = useWatch({ control, name: "technologies" });
  const selectedTechnologies = useMemo(
    () => (Array.isArray(watchedTechnologies) ? watchedTechnologies : []),
    [watchedTechnologies]
  );

  // Get recommended technologies based on component type
  const recommendedTechnologies = useMemo(() => {
    return getTechnologiesForType(componentType);
  }, [componentType]);

  // All unique available backend-supported technologies
  const allTechnologies = useMemo(() => {
    return getAllTechnologies();
  }, []);

  // Filtered technology list based on search query
  const filteredTechnologies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return recommendedTechnologies.length > 0
        ? recommendedTechnologies
        : allTechnologies;
    }
    return allTechnologies.filter((tech) =>
      tech.toLowerCase().includes(query)
    );
  }, [searchQuery, recommendedTechnologies, allTechnologies]);

  // Keep live preview updated
  useEffect(() => {
    updateStepData("techStack", {
      technologies: selectedTechnologies,
    });
    updateStepData("basicInfo", {
      techStack: selectedTechnologies.join(", "),
    });
  }, [selectedTechnologies, updateStepData]);

  const toggleTechnology = (tech) => {
    const exists = selectedTechnologies.includes(tech);
    let updated;
    if (exists) {
      updated = selectedTechnologies.filter((t) => t !== tech);
    } else {
      updated = [...selectedTechnologies, tech];
    }
    setValue("technologies", updated, { shouldValidate: true });
  };

  const removeTechnology = (tech) => {
    const updated = selectedTechnologies.filter((t) => t !== tech);
    setValue("technologies", updated, { shouldValidate: true });
  };

  const addCustomSearchTech = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    // Match case-insensitively with all supported technologies or add trimmed
    const matched = allTechnologies.find(
      (t) => t.toLowerCase() === trimmed.toLowerCase()
    );
    const techToAdd = matched || trimmed;

    if (!selectedTechnologies.includes(techToAdd)) {
      const updated = [...selectedTechnologies, techToAdd];
      setValue("technologies", updated, { shouldValidate: true });
    }
    setSearchQuery("");
  };

  const onSubmit = async (formData) => {
    if (isSubmitting) return;

    const techs = formData.technologies || [];
    if (techs.length === 0) {
      toast.error("Please select at least one technology");
      return;
    }

    if (!wizardId) {
      toast.error("Wizard session not found. Please start from Step 1.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      technologies: techs,
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
          "Technology stack saved successfully"
      );

      const responseData =
        response.data?.currentWizard ||
        response.data?.wizard ||
        response.data;
      const nextStep =
        responseData?.currentStep || response.data?.nextStep || "ownership";

      updateStepData("techStack", {
        technologies: techs,
      });
      updateStepData("basicInfo", {
        techStack: techs.join(", "),
      });

      // Transition to nextStep
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    } catch (err) {
      const message =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save technology stack. Please try again.";

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
        className="flex flex-col gap-6 w-full"
      >
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-(family-name:--headers) text-xl font-semibold text-white">
              Technology Stack
            </h2>
            {componentType && (
              <span className="px-2.5 py-1 text-[11px] font-(family-name:--labels) uppercase tracking-wider rounded-md border border-sky-400/30 bg-sky-500/10 text-sky-300">
                {componentType}
              </span>
            )}
          </div>
          <p className="text-xs text-(--text)/70 font-light leading-relaxed">
            Select the languages, frameworks, libraries, and runtime tools that
            power this component.
          </p>
        </div>

        {submitError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 leading-relaxed">
            {submitError}
          </div>
        )}

        {/* Selected Technologies Counter & Badges */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider">
              <FiLayers className="text-base" />
              Selected Technologies ({selectedTechnologies.length}){" "}
              <span className="text-red-400">*</span>
            </span>
            {selectedTechnologies.length > 0 && (
              <button
                type="button"
                onClick={() => setValue("technologies", [], { shouldValidate: true })}
                className="text-[11px] text-(--text)/50 hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>

          {selectedTechnologies.length > 0 ? (
            <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-[#0D0E11] border border-(--border)/40 min-h-[50px] items-center">
              {selectedTechnologies.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-sky-500/15 border border-sky-400 text-white shadow-[0_0_10px_rgba(56,189,248,0.2)] animate-fadeIn"
                >
                  <BiCodeAlt className="text-sky-300 text-sm" />
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
                    className="p-0.5 rounded hover:bg-sky-400/20 text-sky-200 hover:text-white transition-colors cursor-pointer"
                    aria-label={`Remove ${tech}`}
                  >
                    <FiX className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <div className="p-3.5 rounded-lg bg-[#0D0E11] border border-dashed border-(--border)/40 text-center text-xs text-(--text)/50 font-light">
              No technologies selected yet. Choose from recommendations below or search.
            </div>
          )}

          {errors.technologies && (
            <p className="text-red-400 text-xs">{errors.technologies.message}</p>
          )}
        </div>

        {/* Search / Filter Input */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="techSearch"
            className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider"
          >
            <FiSearch className="text-base" />
            Search or Filter Technologies
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              id="techSearch"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomSearchTech();
                }
              }}
              placeholder="e.g. Node.js, Express, React, PostgreSQL..."
              className="w-full p-3 pr-10 rounded-lg bg-[#0D0E11] text-white border border-(--border)/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:border-sky-400 transition-all duration-200 text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-(--text)/50 hover:text-white transition-colors cursor-pointer"
              >
                <FiX className="text-sm" />
              </button>
            )}
          </div>
        </div>

        {/* Technology Selection List */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider">
              <FiCpu className="text-base" />
              {searchQuery
                ? `Matching Results (${filteredTechnologies.length})`
                : componentType
                ? `Recommended for ${componentType}`
                : "Available Technologies"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {filteredTechnologies.map((tech) => {
              const isSelected = selectedTechnologies.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTechnology(tech)}
                  className={`p-2.5 rounded-lg border font-(family-name:--labels) text-xs transition-all duration-200 transform active:scale-95 flex items-center justify-between cursor-pointer text-left ${
                    isSelected
                      ? "border-sky-400 bg-sky-500/15 text-white shadow-[0_0_12px_rgba(56,189,248,0.3)] scale-[1.01]"
                      : "border-(--border)/40 bg-[#0D0E11] text-(--text)/80 hover:border-(--border) hover:text-white"
                  }`}
                >
                  <span className="font-medium truncate">{tech}</span>
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] transition-colors ${
                      isSelected
                        ? "bg-sky-400 text-black font-bold"
                        : "border border-(--border)/60 text-transparent"
                    }`}
                  >
                    <FiCheck />
                  </div>
                </button>
              );
            })}

            {filteredTechnologies.length === 0 && searchQuery && (
              <div className="col-span-2 flex flex-col items-center justify-center p-4 rounded-lg bg-[#0D0E11] border border-(--border)/30 gap-2">
                <p className="text-xs text-(--text)/60">
                  No predefined technologies found for &quot;{searchQuery}&quot;.
                </p>
                <button
                  type="button"
                  onClick={addCustomSearchTech}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-500/20 border border-sky-400/50 text-sky-300 hover:bg-sky-500/30 text-xs font-medium transition-colors cursor-pointer"
                >
                  <FiPlus />
                  Add &quot;{searchQuery}&quot;
                </button>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
