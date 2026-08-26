import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiShare2,
  FiPlus,
  FiTrash2,
  FiArrowRight,
  FiLink,
  FiLayers,
} from "react-icons/fi";
import api from "../../../api/axios";
import useWizard from "../../../context/WizardContext";

const RELATIONSHIP_TYPES = [
  { value: "calls", label: "Calls (RPC / API)", description: "Direct synchronous service invocation" },
  { value: "reads-from", label: "Reads From", description: "Queries data from a store or service" },
  { value: "writes-to", label: "Writes To", description: "Mutates or writes data to a store" },
  { value: "publishes-to", label: "Publishes To", description: "Emits events/messages to a topic/queue" },
  { value: "subscribes-to", label: "Subscribes To", description: "Listens to events from a topic/queue" },
  { value: "consumes-from", label: "Consumes From", description: "Consumes messages from a stream/queue" },
  { value: "depends-on", label: "Depends On", description: "General operational dependency" },
];

const PROTOCOL_OPTIONS = [
  { value: "HTTPS", label: "HTTPS" },
  { value: "HTTP", label: "HTTP" },
  { value: "gRPC", label: "gRPC" },
  { value: "SQL", label: "SQL" },
  { value: "AMQP", label: "AMQP" },
  { value: "WebSocket", label: "WebSocket" },
];

export default function Relationships() {
  const { projectId } = useParams();
  const { data, updateStepData, setCurrentStep, wizardId } = useWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Available project components
  const [projectComponents, setProjectComponents] = useState([]);
  const [componentsLoading, setComponentsLoading] = useState(false);

  // Configured relationships list
  const initialRelationships = useMemo(() => {
    const existing = data?.relationships;
    if (Array.isArray(existing)) {
      return existing;
    }
    return [];
  }, [data?.relationships]);

  const [relationships, setRelationships] = useState(initialRelationships);

  useEffect(() => {
    if (Array.isArray(data?.relationships) && data.relationships.length > 0) {
      setRelationships(data.relationships);
    }
  }, [data?.relationships]);

  // New relationship draft state
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTargetId, setNewTargetId] = useState("");
  const [newType, setNewType] = useState("calls");
  const [newProtocol, setNewProtocol] = useState("HTTPS");
  const [draftError, setDraftError] = useState(null);

  const { handleSubmit } = useForm();

  // Fetch existing components in current project
  useEffect(() => {
    let isMounted = true;
    const fetchComponents = async () => {
      setComponentsLoading(true);
      try {
        const res = await api.get(`/projects/${projectId}/components`);
        const comps = res.data?.components || res.data?.data || res.data || [];
        if (isMounted) {
          setProjectComponents(Array.isArray(comps) ? comps : []);
        }
      } catch (err) {
        // 404 indicates no components exist yet in the project
        if (err.response?.status !== 404) {
          console.error("Failed to load project components:", err);
        }
        if (isMounted) {
          setProjectComponents([]);
        }
      } finally {
        if (isMounted) setComponentsLoading(false);
      }
    };

    fetchComponents();
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // Filter out the component currently being created from targets
  const currentComponentName = data?.basicInfo?.name || data?.basicInfo?.componentName || "";
  const selectableComponents = useMemo(() => {
    return projectComponents.filter((c) => {
      if (wizardId && c._id === wizardId) return false;
      if (c.name && c.name.toLowerCase() === currentComponentName.toLowerCase()) return false;
      return true;
    });
  }, [projectComponents, wizardId, currentComponentName]);

  // Keep live state in context
  useEffect(() => {
    updateStepData("relationships", relationships);
  }, [relationships, updateStepData]);

  const handleAddRelationship = () => {
    setDraftError(null);

    if (!newTargetId) {
      setDraftError("Please select a target component.");
      return;
    }

    if (!newType) {
      setDraftError("Please select a relationship type.");
      return;
    }

    // Check for duplicate relationship
    const isDuplicate = relationships.some(
      (r) =>
        r.targetId === newTargetId &&
        r.type === newType &&
        r.protocol === newProtocol
    );

    if (isDuplicate) {
      setDraftError("This exact relationship has already been added.");
      return;
    }

    const targetComp = projectComponents.find((c) => c._id === newTargetId);

    const newRel = {
      targetId: newTargetId,
      targetName: targetComp?.name || "Unknown Component",
      targetType: targetComp?.type || "component",
      type: newType,
      protocol: newProtocol || "HTTPS",
    };

    setRelationships([...relationships, newRel]);
    setNewTargetId("");
    setNewType("calls");
    setNewProtocol("HTTPS");
    setIsAddingNew(false);
  };

  const handleRemoveRelationship = (indexToRemove) => {
    setRelationships(relationships.filter((_, idx) => idx !== indexToRemove));
  };

  const onSubmit = async () => {
    if (isSubmitting) return;

    if (!wizardId) {
      toast.error("Wizard session not found. Please start from Step 1.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Format clean relationship items for backend validation
    const payload = {
      relationships: relationships.map((r) => ({
        targetId: r.targetId,
        type: r.type,
        protocol: r.protocol || "HTTPS",
      })),
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
          "Relationships saved successfully"
      );

      const responseData =
        response.data?.currentWizard ||
        response.data?.wizard ||
        response.data;
      const nextStep =
        responseData?.currentStep || response.data?.nextStep || "documentation";

      updateStepData("relationships", payload.relationships);

      // Transition to nextStep
      if (nextStep) {
        setCurrentStep(nextStep);
      }
    } catch (err) {
      const message =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to save relationships. Please try again.";

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
              Component Dependencies & Relationships
            </h2>
            <span className="px-2.5 py-1 text-[11px] font-(family-name:--labels) uppercase tracking-wider rounded-md border border-sky-400/30 bg-sky-500/10 text-sky-300">
              Graph Links
            </span>
          </div>
          <p className="text-xs text-(--text)/70 font-light leading-relaxed">
            Define architectural edges and communication protocols connecting this node
            to other upstream or downstream services in the project.
          </p>
        </div>

        {submitError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 leading-relaxed">
            {submitError}
          </div>
        )}

        {/* Existing Configured Relationships */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="flex gap-1.5 items-center text-(--primary) font-(family-name:--labels) uppercase text-xs tracking-wider">
              <FiLink className="text-base" />
              Configured Relationships ({relationships.length})
            </span>

            {!isAddingNew && (
              <button
                type="button"
                onClick={() => {
                  setDraftError(null);
                  setIsAddingNew(true);
                }}
                disabled={selectableComponents.length === 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectableComponents.length === 0
                    ? "bg-white/5 text-(--text)/40 cursor-not-allowed border border-(--border)/30"
                    : "bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/40"
                }`}
              >
                <FiPlus /> Add Relationship
              </button>
            )}
          </div>

          {/* New Relationship Draft Form */}
          {isAddingNew && (
            <div className="p-4 rounded-xl bg-[#0D0E11] border border-sky-400/40 flex flex-col gap-3.5 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <FiShare2 className="text-sky-400" /> New Relationship Connection
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingNew(false);
                    setDraftError(null);
                  }}
                  className="text-xs text-(--text)/50 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {draftError && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">
                  {draftError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                {/* Target Component */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-(family-name:--labels) text-(--text)/80 uppercase">
                    Target Node <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={newTargetId}
                    onChange={(e) => setNewTargetId(e.target.value)}
                    className="p-2 rounded-lg bg-[#131519] text-white border border-(--border)/40 text-xs focus:outline-none focus:border-sky-400"
                  >
                    <option value="">Select a target node...</option>
                    {selectableComponents.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.type || "node"})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Relationship Type */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-(family-name:--labels) text-(--text)/80 uppercase">
                    Interaction Type <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="p-2 rounded-lg bg-[#131519] text-white border border-(--border)/40 text-xs focus:outline-none focus:border-sky-400"
                  >
                    {RELATIONSHIP_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Protocol */}
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-(family-name:--labels) text-(--text)/80 uppercase">
                    Protocol <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={newProtocol}
                    onChange={(e) => setNewProtocol(e.target.value)}
                    className="p-2 rounded-lg bg-[#131519] text-white border border-(--border)/40 text-xs focus:outline-none focus:border-sky-400"
                  >
                    {PROTOCOL_OPTIONS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddRelationship}
                  className="px-4 py-1.5 bg-sky-500 text-black font-semibold rounded-lg text-xs hover:bg-sky-400 transition-colors cursor-pointer"
                >
                  Save Connection
                </button>
              </div>
            </div>
          )}

          {/* List of Relationships */}
          {relationships.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
              {relationships.map((rel, idx) => {
                const targetComp = projectComponents.find(
                  (c) => c._id === rel.targetId
                );
                const targetDisplayName =
                  targetComp?.name || rel.targetName || "Target Node";
                const targetType = targetComp?.type || rel.targetType || "service";

                return (
                  <div
                    key={`${rel.targetId}-${rel.type}-${rel.protocol}-${idx}`}
                    className="p-3 rounded-lg bg-[#0D0E11] border border-(--border)/40 flex items-center justify-between hover:border-(--border) transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="px-2 py-1 rounded bg-sky-500/15 border border-sky-400/30 text-sky-300 text-[11px] font-mono font-medium">
                        {currentComponentName || "This Node"}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-(--text)/60">
                        <FiArrowRight className="text-sky-400" />
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-(--border)/30 text-white font-medium text-[11px]">
                          {rel.type}
                        </span>
                        <FiArrowRight className="text-sky-400" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white text-xs">
                          {targetDisplayName}
                        </span>
                        <span className="text-[10px] text-(--text)/50 px-1.5 py-0.5 rounded bg-white/5 font-mono">
                          {targetType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">
                        {rel.protocol}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRelationship(idx)}
                        className="p-1 rounded text-(--text)/50 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                        title="Remove relationship"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-5 rounded-lg bg-[#0D0E11] border border-dashed border-(--border)/40 flex flex-col items-center justify-center gap-2 text-center">
              <FiLayers className="text-2xl text-(--text)/40" />
              <p className="text-xs text-(--text)/70 font-light">
                {componentsLoading
                  ? "Loading project components..."
                  : selectableComponents.length === 0
                  ? "No other components currently exist in this project. Relationships are optional and can be linked later."
                  : "No relationships configured yet. Click 'Add Relationship' above to connect this component."}
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
