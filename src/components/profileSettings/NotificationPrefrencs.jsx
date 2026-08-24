import { TbTopologyStar } from "react-icons/tb";
import { MdOutlineBadge } from "react-icons/md";
import { TbFileDescription } from "react-icons/tb";
import { TbAlertTriangle } from "react-icons/tb";
import { TbTopologyStar3 } from "react-icons/tb";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { useState } from "react";
import useMyProfile from "../../hooks/useMyProfile";
import api from "../../api/axios";

export default function NotificationPrefrencs() {
  const { user, loading, error } = useMyProfile();

  const [enabledOwnershipChanges, setEnabledOwnershipChanges] = useState(true);
  const [enabledprojectAssignment, setEnabledProjectAssignment] =
    useState(true);
  const [enabledrelationshipChanges, setEnabledRelationshipChanges] =
    useState(true);
  const [enabledCriticalAlerts, setEnabledCriticalAlerts] = useState(true);
  const [enabledDocumentationAlerts, setEnabledDocumentationAlerts] =
    useState(true);

  const [syncedUserId, setSyncedUserId] = useState(null);

  if (user?._id && user._id !== syncedUserId) {
    setSyncedUserId(user._id);
    setEnabledOwnershipChanges(user.notificationPreferences.ownershipChanges);
    setEnabledProjectAssignment(user.notificationPreferences.projectAssignment);
    setEnabledRelationshipChanges(
      user.notificationPreferences.relationshipChanges,
    );
    setEnabledCriticalAlerts(user.notificationPreferences.criticalAlerts);
    setEnabledDocumentationAlerts(
      user.notificationPreferences.documentationAlerts,
    );
  }

  const updatePreference = async (key, value) => {
    try {
      await api.patch("/profile/me/notifications", { key, value });
    } catch (err) {
      console.error(err.response?.data?.msg || err.message);
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-700">{error}</p>;

  return (
    <>
      <div className="flex items-center gap-3 mb-10">
        <MdOutlineNotificationsActive className="text-[#D8E2FF] text-4xl" />
        <h2 className="text-2xl font-medium text-[#E3E2E7]">
          Notification Preferences
        </h2>
      </div>
      <div className="bg-[#1E1F23] border border-[#2D303A] rounded-2xl  pt-6">
        <div className="flex justify-between items-center border-b border-[#2D303A] px-6 pb-5">
          <div className="flex gap-5 items-center">
            <TbTopologyStar className="text-4xl" />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl text-[#E3E2E7] leading-6">
                Ownership Changes
              </h2>
              <div className="text-sm text-[#C4C6D0] leading-4">
                Alerts when components you own are transferred or modified.
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                const newValue = !enabledOwnershipChanges;
                setEnabledOwnershipChanges(newValue);
                updatePreference("ownershipChanges", newValue);
              }}
              className={`relative h-6 w-11 rounded-full transition-all duration-500
        ${enabledOwnershipChanges ? "bg-[#ADC6FF]" : "bg-[#343538]"}`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full  transition-all  duration-500
          ${enabledOwnershipChanges ? "-translate-x-4.5" : "translate-x-0.5"} 
          ${enabledOwnershipChanges ? "bg-[#001A42]" : "bg-[#C4C6D0]"}`}
              />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center border-b border-[#2D303A] px-6 py-5">
          <div className="flex gap-5 items-center">
            <MdOutlineBadge className="text-4xl" />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl text-[#E3E2E7] leading-6">
                Project Assignment Updates
              </h2>
              <div className="text-sm text-[#C4C6D0] leading-4">
                Instant notification when you are added to a new system project.
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                const newValue = !enabledprojectAssignment;
                setEnabledProjectAssignment(newValue);
                updatePreference("projectAssignment", newValue);
              }}
              className={`relative h-6 w-11 rounded-full transition-all duration-500
        ${enabledprojectAssignment ? "bg-[#ADC6FF]" : "bg-[#343538]"}`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full  transition-all  duration-500
          ${enabledprojectAssignment ? "-translate-x-4.5" : "translate-x-0.5"} 
          ${enabledprojectAssignment ? "bg-[#001A42]" : "bg-[#C4C6D0]"}`}
              />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center border-b border-[#2D303A] px-6 py-5">
          <div className="flex gap-5 items-center">
            <TbTopologyStar3 className="text-4xl" />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl text-[#E3E2E7] leading-6">
                Relationship Changes
              </h2>
              <div className="text-sm text-[#C4C6D0] leading-4 ">
                Signals when dependency paths are altered in managed components.
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                const newValue = !enabledrelationshipChanges;
                setEnabledRelationshipChanges(newValue);
                updatePreference("relationshipChanges", newValue);
              }}
              className={`relative h-6 w-11 rounded-full transition-all duration-500
        ${enabledrelationshipChanges ? "bg-[#ADC6FF]" : "bg-[#343538]"}`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full  transition-all  duration-500
          ${enabledrelationshipChanges ? "-translate-x-4.5" : "translate-x-0.5"} 
          ${enabledrelationshipChanges ? "bg-[#001A42]" : "bg-[#C4C6D0]"}`}
              />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center border-b border-[#2D303A] px-6 py-5">
          <div className="flex gap-5 items-center">
            <TbAlertTriangle className="text-4xl text-[#FF8A80]" />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl text-[#E3E2E7] leading-6">
                Critical Component Alerts
              </h2>
              <div className="text-sm text-[#C4C6D0] leading-4">
                High-priority alerts for status changes in mission-critical
                infrastructure.
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                const newValue = !enabledCriticalAlerts;
                setEnabledCriticalAlerts(newValue);
                updatePreference("criticalAlerts", newValue);
              }}
              className={`relative h-6 w-11 rounded-full transition-all duration-500
        ${enabledCriticalAlerts ? "bg-[#ADC6FF]" : "bg-[#343538]"}`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full  transition-all  duration-500
          ${enabledCriticalAlerts ? "-translate-x-4.5" : "translate-x-0.5"} 
          ${enabledCriticalAlerts ? "bg-[#001A42]" : "bg-[#C4C6D0]"}`}
              />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center  px-6 pt-5 pb-6">
          <div className="flex gap-5 items-center">
            <TbFileDescription className="text-4xl" />
            <div className="flex flex-col gap-2">
              <h2 className="text-xl text-[#E3E2E7] leading-6">
                Documentation Alerts
              </h2>
              <div className="text-sm text-[#C4C6D0] leading-4">
                Updates regarding API docs or system architecture diagrams.
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => {
                const newValue = !enabledDocumentationAlerts;
                setEnabledDocumentationAlerts(newValue);
                updatePreference("documentationAlerts", newValue);
              }}
              className={`relative h-6 w-11 rounded-full transition-all duration-500
        ${enabledDocumentationAlerts ? "bg-[#ADC6FF]" : "bg-[#343538]"}`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full  transition-all  duration-500
          ${enabledDocumentationAlerts ? "-translate-x-4.5" : "translate-x-0.5"} 
          ${enabledDocumentationAlerts ? "bg-[#001A42]" : "bg-[#C4C6D0]"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
