import Sidebar from "../components/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import useAuth from "../context/AuthContext";

export default function InnerLayout() {
  const { user } = useAuth();

  const onboardingVal =
    user?.user?.onboarding !== undefined
      ? user.user.onboarding
      : user?.user?.onboardingStatus !== undefined
      ? user.user.onboardingStatus
      : user?.onboarding !== undefined
      ? user.onboarding
      : user?.onboardingStatus;

  const isOnboarding = onboardingVal === "pending";

  return (
    <div className="flex w-full min-h-screen">
      {!isOnboarding && <Sidebar />}
      <Outlet />
    </div>
  );
}