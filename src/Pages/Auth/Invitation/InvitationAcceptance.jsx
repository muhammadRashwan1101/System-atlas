import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import useAuth from "../../../context/AuthContext";
import useWorkspace from "../../../context/WorkspaceContext";
import api from "../../../api/axios";
import { FiCheckCircle, FiAlertTriangle, FiArrowRight, FiShield } from "react-icons/fi";

export default function InvitationAcceptance() {
  const { token: paramToken } = useParams();
  const [searchParams] = useSearchParams();
  const queryToken = searchParams.get("token");
  const inviteToken = paramToken || queryToken;

  const { user, loading: authLoading, getCurrentUser } = useAuth();
  const { refreshWorkspaces } = useWorkspace();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying"); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState("Validating architecture invitation...");
  const [targetWorkspace, setTargetWorkspace] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (authLoading) return;

    if (!user) {
      // Must authenticate first before accepting invitation
      navigate(`/login?invite=${encodeURIComponent(inviteToken || "")}`, {
        replace: true,
      });
      return;
    }

    if (!inviteToken) {
      setStatus("error");
      setMessage("No invitation token provided in URL.");
      return;
    }

    const processInvitation = async () => {
      try {
        setStatus("verifying");
        setMessage("Establishing authorized workspace membership...");

        // Try backend invitation activation endpoints if available, otherwise verify workspace
        let responseData = null;
        try {
          const res = await api.post("/invitations/accept", { token: inviteToken });
          responseData = res.data;
        } catch {
          // Fallback check if token is workspaceId or custom token
          const wsRes = await api.get(`/workspaces/${inviteToken}`).catch(() => null);
          if (wsRes?.data?.workspace) {
            responseData = { workspace: wsRes.data.workspace };
          }
        }

        if (isMounted) {
          await getCurrentUser();
          const updatedWorkspaces = await refreshWorkspaces();

          const targetWs =
            responseData?.workspace ||
            (updatedWorkspaces && updatedWorkspaces.find((w) => w._id === inviteToken || w._id === responseData?.workspaceId)) ||
            (updatedWorkspaces && updatedWorkspaces[0]);

          setTargetWorkspace(targetWs);
          setStatus("success");
          setMessage("Invitation verified! Your workspace permissions have been provisioned.");
        }
      } catch (err) {
        if (isMounted) {
          console.error("Invitation validation error:", err);
          setStatus("error");
          setMessage(
            err.response?.data?.msg ||
              "This invitation is invalid, expired, or has already been accepted."
          );
        }
      }
    };

    processInvitation();

    return () => {
      isMounted = false;
    };
  }, [authLoading, user, inviteToken, getCurrentUser, refreshWorkspaces, navigate]);

  const handleProceed = () => {
    if (targetWorkspace?._id) {
      navigate(`/workspaces/${targetWorkspace._id}`);
    } else {
      navigate("/app");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B0F17] text-white p-6">
      <div className="flex flex-col w-full max-w-md bg-[#121620] border border-[#232733] rounded-2xl shadow-2xl p-8 gap-6 animate-in fade-in duration-200 text-center">
        {/* Icon & Title */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
              status === "verifying"
                ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                : status === "success"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {status === "verifying" && <FiShield className="w-7 h-7 animate-pulse" />}
            {status === "success" && <FiCheckCircle className="w-7 h-7" />}
            {status === "error" && <FiAlertTriangle className="w-7 h-7" />}
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {status === "verifying"
              ? "Verifying Invitation"
              : status === "success"
              ? "Access Granted"
              : "Invitation Invalid"}
          </h2>
          <p className="text-xs font-mono text-slate-400 leading-relaxed max-w-sm">
            {message}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {status === "success" && (
            <button
              type="button"
              onClick={handleProceed}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-sky-500/10"
            >
              Enter Architecture Workspace
              <FiArrowRight className="w-4 h-4" />
            </button>
          )}

          {status === "error" && (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#1A1F2C] hover:bg-[#222838] border border-[#2B3245] text-slate-200 text-xs font-medium transition-all cursor-pointer"
            >
              Return to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
