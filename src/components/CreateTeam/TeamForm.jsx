import { FiInfo } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

export default function TeamForm({
  formRef,
  onInputChange,
  onFinalSubmit,
  resetTrigger,
}) {
 const {
 register,
 handleSubmit,
 reset,
 formState:{errors}
}=useForm({
    mode: "onSubmit",
  });

  // Reset form when creating another team
  useEffect(() => {
    if (resetTrigger) {
      reset();
    }
  }, [resetTrigger]);

  const submitForm = (data) => {
    if (onFinalSubmit) {
      onFinalSubmit(data);
    }
  };

  return (
    <div className="flex flex-col w-full text-white">

      <div className="flex flex-col mb-6 gap-2">
        <h1 className="text-3xl font-bold text-white text-shadow-[0_0px_18px_rgba(138,175,207,0.5)]">
          Provision New Team
        </h1>

        <p className="text-sm text-slate-400">
          Initialize a sovereign engineering unit within the Atlas ecosystem.
        </p>
      </div>


      <form
        ref={formRef}
        onSubmit={handleSubmit(submitForm)}
        className="flex flex-col gap-3 w-full"
      >

        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono tracking-widest uppercase mb-1">
          <FiInfo className="text-sm" />
          <span>Basic Information</span>
        </div>


        <div className="grid grid-cols-2 gap-4 w-full">

          {/* Team Name */}
          <div className="flex flex-col gap-2">

            <label
              htmlFor="teamName"
              className="text-slate-400 font-mono text-[11px] tracking-wider uppercase"
            >
              Team Name
            </label>

            <input
              type="text"
              id="teamName"
              placeholder="e.g. Core Observability"
              {...register("teamName", {
                required: "Team name is required",
                minLength: {
                  value: 3,
                  message: "Must be at least 3 characters",
                },
                onChange: (e) =>
                  onInputChange &&
                  onInputChange("teamName", e.target.value),
              })}
              className="w-full px-4 py-3 bg-[#0d0f14] border border-slate-800/80 rounded-md text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
            />

            {errors.teamName && (
              <p className="text-red-500 text-xs">
                {errors.teamName.message}
              </p>
            )}

          </div>



          {/* Team Code */}
          <div className="flex flex-col gap-2">

            <label
              htmlFor="teamCode"
              className="text-slate-400 font-mono text-[11px] tracking-wider uppercase"
            >
              Team Code (MONO)
            </label>


            <input
              type="text"
              id="teamCode"
              placeholder="OBS-CORE"
              {...register("teamCode", {
                required: "Team code is required",

                onChange: (e) =>
                  onInputChange &&
                  onInputChange("teamCode", e.target.value),
              })}
              className="w-full px-4 py-3 bg-[#0d0f14] border border-slate-800/80 rounded-md text-sm text-slate-200 placeholder:text-slate-600 uppercase focus:outline-none focus:border-slate-600 transition-colors"
            />


            {errors.teamCode && (
              <p className="text-red-500 text-xs">
                {errors.teamCode.message}
              </p>
            )}

          </div>

        </div>



        {/* Description */}
        <div className="flex flex-col gap-2 w-full mt-2">

          <label
            htmlFor="description"
            className="text-slate-400 font-mono text-[11px] tracking-wider uppercase"
          >
            Description
          </label>


          <textarea
            id="description"
            rows={4}
            placeholder="Define the core mission and architectural scope of this team..."
            {...register("description", {
              required: "Description is required",

              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },

              onChange: (e) =>
                onInputChange &&
                onInputChange("description", e.target.value),
            })}
            className="w-full px-4 py-3 bg-[#0d0f14] border border-slate-800/80 rounded-md text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-slate-600 transition-colors resize-none"
          />


          {errors.description && (
            <p className="text-red-500 text-xs">
              {errors.description.message}
            </p>
          )}

        </div>


        {/* Submit handled from footer */}
        <button type="submit" className="hidden" />

      </form>

    </div>
  );
}