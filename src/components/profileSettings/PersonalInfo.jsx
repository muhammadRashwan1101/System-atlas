import { useState } from "react";
import { MdOutlineMail } from "react-icons/md";
import { BiIdCard } from "react-icons/bi";
import { FiCheck } from "react-icons/fi";
import api from "../../api/axios";
import useMyProfile from "../../hooks/useMyProfile";

export default function PersonalInfo({ isEditing, onCancel, onSaved }) {
  const { user, loading, error, refetch } = useMyProfile();

  
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    jobTitle: user?.jobTitle || "",
    department: user?.department || "",
  }));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);
      await api.patch("/profile/me", form);
      await refetch();
      onSaved?.();
    } catch (err) {
      setSaveError(err.response?.data?.msg || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-700">{error}</p>;
  if (!user) return null;

  const inputClass =
    "w-full bg-[#2A2C33] border border-[#424552] rounded-md px-3 py-2 text-[#E3E2E7] focus:outline-none focus:border-[#ADC6FF]";

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <BiIdCard className="text-[#D8E2FF] text-4xl" />
          <h2 className="text-3xl font-medium text-[#E3E2E7]">
            Personal Information
          </h2>
        </div>

        {isEditing && (
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={saving}
              className="px-4 py-2 rounded-md text-[#C4C6D0] border border-[#424552] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#4EDEA3] text-[#003824] font-semibold disabled:opacity-50"
            >
              <FiCheck />
              {saving ? "Saving..." : "Done"}
            </button>
          </div>
        )}
      </div>

      {saveError && <p className="text-red-400 text-sm mb-4">{saveError}</p>}

      <div className="bg-[#1E1F23] border border-[#2D303A] rounded-2xl p-10 grid grid-cols-2 gap-x-12 gap-y-8">
        <div>
          <p className="text-xs uppercase tracking-[3px] text-gray-500 mb-2">
            First Name
          </p>
          {isEditing ? (
            <input
              className={inputClass}
              value={form.firstName}
              onChange={handleChange("firstName")}
            />
          ) : (
            <p className="text-[#E3E2E7]">{user.firstName}</p>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[3px] text-gray-500 mb-2">
            Last Name
          </p>
          {isEditing ? (
            <input
              className={inputClass}
              value={form.lastName}
              onChange={handleChange("lastName")}
            />
          ) : (
            <p className="text-[#E3E2E7]">{user.lastName}</p>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[3px] text-gray-500 mb-2">
            Role
          </p>
          <p className="text-emerald-400 capitalize">{user.role}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[3px] text-gray-500 mb-2">
            Email Address
          </p>
          <p className="flex items-center gap-2 text-[#E3E2E7]">
            <MdOutlineMail />
            {user.email}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[3px] text-gray-500 mb-2">
            Job Title
          </p>
          {isEditing ? (
            <input
              className={inputClass}
              value={form.jobTitle}
              onChange={handleChange("jobTitle")}
            />
          ) : (
            <p className="text-[#E3E2E7]">{user.jobTitle || "—"}</p>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[3px] text-gray-500 mb-2">
            Reports To
          </p>
          <p className="text-[#E3E2E7]">
            {user.reportsTo ? user.reportsTo.fullName : "—"}
          </p>
        </div>

        <div className="col-span-2">
          <p className="text-xs uppercase tracking-[3px] text-gray-500 mb-2">
            Department
          </p>
          {isEditing ? (
            <input
              className={inputClass}
              value={form.department}
              onChange={handleChange("department")}
            />
          ) : (
            <p className="text-[#E3E2E7]">{user.department || "—"}</p>
          )}
        </div>
      </div>
    </div>
  );
}