import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineFileText, AiOutlineCloud } from "react-icons/ai";
import { RxGear } from "react-icons/rx";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsDatabase } from "react-icons/bs";
import { MdOutlineSettingsInputComposite, MdOutlineHub } from "react-icons/md";
import { CgScreen } from "react-icons/cg";
import { BiTag } from "react-icons/bi";
import api from "../../../api/axios";
import useWizard from "../../../context/WizardContext";

const COMPONENT_TYPES = [

  {
    id: "API-Gateway",
    type: "api-gateway",
    value: "api-gateway",
    icon: MdOutlineHub,
  },
  {
    id: "Frontend",
    type: "frontend",
    value: "frontend",
    icon: CgScreen,
  },
  {
    id: "Backend",
    type: "backend",
    value: "backend",
    icon: MdOutlineSettingsInputComposite,
  },
  {
    id: "Database",
    type: "database",
    value: "database",
    icon: BsDatabase,
  },
  {
    id: "Queue",
    type: "queue",
    value: "queue",
    icon: GiHamburgerMenu,
  },
  {
    id: "Cloud-Service",
    type: "cloud-service",
    value: "cloud-service",
    icon: AiOutlineCloud,
  },
];

export default function BasicInfo() {
  const { workspaceId, projectId, wizardId: paramWizardId } = useParams();
  const navigate = useNavigate();

  const {
    data,
    updateStepData,
    setCurrentStep,
    setWizardId,
    wizardId: contextWizardId,
  } = useWizard();
  const activeWizardId = paramWizardId || contextWizardId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);



  const initialValues = data?.basicInfo || {};

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: initialValues.name || initialValues.componentName || "",
      type: initialValues.type || initialValues.componentType || "",
      description: initialValues.description || "",
    },
  });

  const hasInitializedRef = useState(false);

  // Re-sync form fields ONCE if wizard session/component data loads asynchronously
  useEffect(() => {
    if (!hasInitializedRef[0] && (data?.basicInfo?.name || data?.basicInfo?.type)) {
      hasInitializedRef[1](true);
      reset({
        name: data.basicInfo.name || data.basicInfo.componentName || "",
        type: data.basicInfo.type || data.basicInfo.componentType || "",
        description: data.basicInfo.description || "",
      });
    }
  }, [
    data?.basicInfo?.name,
    data?.basicInfo?.type,
    data?.basicInfo?.description,
    reset,
    hasInitializedRef,
  ]);

  const selectedName = useWatch({ control, name: "name" });
  const selectedType = useWatch({ control, name: "type" });
  const selectedDescription = useWatch({ control, name: "description" });

  // Keep state live for Preview updates
  useEffect(() => {
    if (selectedName !== undefined || selectedType !== undefined || selectedDescription !== undefined) {
      updateStepData("basicInfo", {
        name: selectedName || "",
        componentName: selectedName || "",
        type: selectedType || "",
        componentType: selectedType || "",
        description: selectedDescription || "",
      });
    }
  }, [selectedName, selectedType, selectedDescription, updateStepData]);

  const handleTypeSelect = (typeValue) => {
    setValue("type", typeValue, { shouldValidate: true });
  };

  const onSubmit = async (formData) => {
    if (isSubmitting) return;
    if (!formData.type) {
      toast.error("Please select a component type");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      step: "basicInfo",
      name: formData.name.trim(),
      componentName: formData.name.trim(),
      type: formData.type,
      componentType: formData.type,
      description: (formData.description || "").trim(),
    };

    try {
      let response;
      if (activeWizardId) {
        // Update existing wizard session / editing component via PATCH to avoid duplicate creation
        try {
          response = await api.patch(
            `/projects/${projectId}/wizard/${activeWizardId}`,
            payload
          );
        } catch (patchErr) {
          if (
            patchErr.response?.status === 404 ||
            patchErr.response?.status === 405
          ) {
            try {
              response = await api.patch(
                `/projects/${projectId}/components/${activeWizardId}`,
                payload
              );
            } catch {
              response = await api.post(
                `/projects/${projectId}/wizard/${activeWizardId}`,
                payload
              );
            }
          } else {
            throw patchErr;
          }
        }
      } else {
        // Initial creation of wizard session
        response = await api.post(`/projects/${projectId}/wizard`, payload);
      }

      toast.success(
        response.data?.msg ||
          response.data?.message ||
          "Basic information saved successfully"
      );

      const responseData =
        response.data?.initialData ||
        response.data?.currentWizard ||
        response.data?.wizard ||
        response.data;
      const nextStep =
        responseData?.currentStep || response.data?.nextStep || "techStack";
      const returnedWizardId =
        responseData?.wizardId ||
        responseData?._id ||
        response.data?.wizardId ||
        activeWizardId;

      if (returnedWizardId) {
        setWizardId(returnedWizardId);
      }

      updateStepData("basicInfo", {
        ...payload,
        id: returnedWizardId || activeWizardId,
      });

      // Advance to next step
      if (nextStep) {
        setCurrentStep(nextStep);
      }

      // Update URL if new session ID was created
      if (returnedWizardId && !paramWizardId) {
        navigate(
          `/workspaces/${workspaceId}/projects/${projectId}/wizard/${returnedWizardId}`,
          { replace: true }
        );
      }
    } catch (err) {
      const message =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save basic component information. Please try again.";

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
        <div className="flex flex-col gap-2">
          <h2 className="font-(family-name:--headers) text-xl font-semibold text-white">
            Basic Component Information
          </h2>
          <p className="text-xs text-(--text)/70 font-light leading-relaxed">
            Define the fundamental identity and classification of your new architectural node
            within the System Atlas graph.
          </p>
        </div>

        {submitError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
            {submitError}
          </div>
        )}

        <div className="flex flex-col gap-5">
          {/* Component Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="componentName"
              className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider"
            >
              <BiTag className="rotate-y-180 text-base" />
              Component Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="componentName"
              placeholder="e.g. Authentication-Service"
              {...register("name", {
                required: "Component name is required",
                minLength: {
                  value: 2,
                  message: "Component name must be at least 2 characters",
                },
              })}
              className="p-3 rounded-lg bg-[#0D0E11] text-white border border-(--border)/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:border-sky-400 transition-all duration-200"
            />
            {errors.name ? (
              <p className="text-red-400 text-xs">{errors.name.message}</p>
            ) : (
              <p className="text-[11px] text-(--text)/50 font-light italic">
                Naming should follow kebab-case or PascalCase conventions.
              </p>
            )}
          </div>

          {/* Component Type */}
          <div className="flex flex-col gap-2.5">
            <span className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider">
              <RxGear className="text-base" />
              Component Type <span className="text-red-400">*</span>
            </span>

            <input
              type="hidden"
              {...register("type", {
                required: "Component type is required",
              })}
            />

            <div className="grid grid-cols-2 gap-3">
              {COMPONENT_TYPES.map((item) => {
                const IconComponent = item.icon;
                const isSelected = selectedType === item.type || selectedType === item.value;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTypeSelect(item.type)}
                    className={`p-3 rounded-lg border font-(family-name:--labels) text-xs transition-all duration-200 transform active:scale-95 flex items-center gap-2.5 cursor-pointer text-left ${isSelected
                      ? "border-sky-400 bg-sky-500/15 text-white shadow-[0_0_12px_rgba(56,189,248,0.3)] scale-[1.02]"
                      : "border-(--border)/40 bg-[#0D0E11] text-(--text)/80 hover:border-(--border) hover:text-white"
                      }`}
                  >
                    <div
                      className={`p-1.5 rounded-md text-lg transition-colors ${isSelected ? "bg-sky-500/20 text-sky-300" : "bg-white/5 text-(--text)"
                        }`}
                    >
                      <IconComponent />
                    </div>
                    <span className="font-medium truncate">{item.type}</span>
                  </button>
                );
              })}
            </div>
            {errors.type && <p className="text-red-400 text-xs">{errors.type.message}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="componentDescription"
              className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider"
            >
              <AiOutlineFileText className="text-base" />
              Description
            </label>
            <textarea
              id="componentDescription"
              rows={3}
              placeholder="Briefly describe the purpose, responsibilities, and architecture role of this component..."
              {...register("description")}
              className="resize-none p-3 rounded-lg bg-[#0D0E11] text-white border border-(--border)/40 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] focus:outline-none focus:border-sky-400 transition-all duration-200"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  );
}
