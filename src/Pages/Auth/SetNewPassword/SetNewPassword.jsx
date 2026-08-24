import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FiLock, FiCheck, FiShield, FiArrowRight } from "react-icons/fi";
import useAuth from "../../../context/AuthContext";
import api from "../../../api/axios";

export default function SetNewPassword() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const navigate = useNavigate();
  const { getCurrentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const newPassword = watch("newPassword", "");

  const onSubmit = async (data) => {
    setSubmitting(true);
    setServerError(null);

    try {
      await api.patch("/auth/set-password", {
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      // Refresh current user session so mustChangePassword becomes false
      await getCurrentUser();

      // Delegate final navigation to AppEntry
      navigate("/app", { replace: true });
    } catch (err) {
      setServerError(
        err.response?.data?.msg ||
          "Failed to update password. Please ensure your new password differs from temporary credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const passwordRequirements = [
    { text: "At least 6 characters long", met: newPassword.length >= 6 },
    {
      text: "Contains letters and numbers",
      met: /[a-zA-Z]/.test(newPassword) && /[0-9]/.test(newPassword),
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080A0F] text-white p-6">
      <div className="flex flex-col w-full max-w-md bg-[#10141E] border border-[#232938] rounded-2xl shadow-2xl p-8 gap-6 animate-in fade-in duration-200">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex items-center justify-center p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <FiShield className="w-8 h-8" />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Set Permanent Password
            </h1>
            <p className="text-xs text-slate-400 font-light leading-relaxed mt-1">
              Your account was created by your organization using temporary credentials. For security, you must create a new password before accessing System Atlas.
            </p>
          </div>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {serverError}
          </div>
        )}

        {/* Password Setup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="newPassword"
              className="text-xs font-mono text-slate-300 font-medium"
            >
              New Password
            </label>
            <div className="relative flex items-center">
              <input
                id="newPassword"
                type="password"
                placeholder="Enter strong new password"
                className="w-full py-2.5 px-3.5 pl-10 rounded-xl bg-[#171C2B] border border-[#2B354C] focus:border-sky-400 focus:outline-none text-sm text-white placeholder:text-slate-500 transition-colors"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <FiLock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {errors.newPassword && (
              <span className="text-xs text-red-400 font-mono mt-0.5">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="confirmPassword"
              className="text-xs font-mono text-slate-300 font-medium"
            >
              Confirm New Password
            </label>
            <div className="relative flex items-center">
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                className="w-full py-2.5 px-3.5 pl-10 rounded-xl bg-[#171C2B] border border-[#2B354C] focus:border-sky-400 focus:outline-none text-sm text-white placeholder:text-slate-500 transition-colors"
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (val) =>
                    val === newPassword || "Passwords do not match",
                })}
              />
              <FiLock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-red-400 font-mono mt-0.5">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Password Requirements Checklist */}
          <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#141824] border border-[#232938] text-[11px] font-mono text-slate-400">
            <span className="font-semibold text-slate-300 mb-0.5">
              Password Requirements:
            </span>
            {passwordRequirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                    req.met
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-700/40 text-slate-500 border border-slate-600/30"
                  }`}
                >
                  <FiCheck className="w-2.5 h-2.5" />
                </span>
                <span className={req.met ? "text-slate-200" : "text-slate-400"}>
                  {req.text}
                </span>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-sky-500/10 disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Activate Account & Enter
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-[11px] font-mono text-slate-500 border-t border-[#232938] pt-4">
          SYSTEM ATLAS ENTERPRISE GOVERNANCE
        </div>
      </div>
    </div>
  );
}
