import { useRef, useState } from "react";
import { MdOutlineModeEdit } from "react-icons/md";
import { CgSoftwareUpload } from "react-icons/cg";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { RiOrganizationChart } from "react-icons/ri";
import { BiCheckShield } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineCamera } from "react-icons/ai";
import profile_pic from "../../assets/profile-pic/profliePic.png";

import api, { SERVER_URL } from "../../api/axios";

export default function ProfileHeader({ isEditing, onEditToggle , user, loading, error, refetch}) {

  const fileInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only JPEG, PNG or WEBP images are allowed");
      e.target.value = "";
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image must be less than 2MB");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      setUploadError(null);
      await api.patch("/profile/me/avatar", formData);
      await refetch();
    } catch (err) {
      setUploadError(err.response?.data?.msg || err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-700">{error}</p>;
  if (!user) return null;

  const shortId = user._id ? `#${user._id.slice(-8).toUpperCase()}` : "—";
  const workspacesCount = user.workspaceAccess?.length ?? 0;

  const avatarSrc = user.avatar ? `${SERVER_URL}${user.avatar}` : profile_pic;

  return (
    <>
      <div className="bg-[#1E1F23] border border-[#2D303A] rounded-2xl py-10 px-13 grid grid-cols-10">
        <div className="col-span-1 relative">
          <img
            src={avatarSrc}
            alt="Profile Picture"
            className={`w-45 border-2 border-[#D8E2FF4D] p-2 rounded-2xl ${
              uploading ? "opacity-50" : ""
            }`}
          />

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleCameraClick}
            disabled={uploading}
            className="absolute -bottom-1.5 -right-3.5 text-[#122F5F] bg-[#D8E2FF] text-2xl p-2 rounded-xl disabled:opacity-50"
          >
            <AiOutlineCamera />
          </button>
        </div>

        <div className="col-span-7 flex justify-center gap-2.5 flex-col px-8">
          <div className="flex gap-4 items-center">
            <h1 className="text-4xl capitalize text-[#D8E2FF] font-medium">
              {user.fullName}
            </h1>
            <span className="text-[#C4C6D0] bg-[#343538] border border-[#424552] rounded-sm py-0.5 px-1.5">
              ID: {shortId}
            </span>
          </div>

          {uploadError && (
            <p className="text-red-400 text-sm">{uploadError}</p>
          )}

          <div className="flex gap-5">
            <div className="flex items-center gap-2">
              <BiCheckShield className="text-xl text-[#D8E2FF]" />
              <span className="text-[#C4C6D0] text-lg">
                {user.jobTitle || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RiOrganizationChart className="text-xl text-[#4EDEA3]" />
              <span className="text-[#C4C6D0] text-lg">
                {user.department || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AiOutlineFolderOpen className="text-xl text-[#FFB786]" />
              <span className="text-[#C4C6D0] text-lg">
                {workspacesCount} Workspaces
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-2 gap-4 flex flex-col font-semibold justify-center items-end">
          <button
            onClick={onEditToggle}
            className="w-50 flex items-center justify-center py-4 bg-[#ADC6FF] text-[#385283] rounded-lg"
          >
            {isEditing ? (
              <>
                <AiOutlineClose className="text-xl mr-2" />
                Cancel Editing
              </>
            ) : (
              <>
                <MdOutlineModeEdit className="text-xl mr-2" />
                Edit Profile
              </>
            )}
          </button>
          <button
            onClick={handleCameraClick}
            disabled={uploading}
            className="w-50 flex items-center justify-center py-4 bg-[#343538] text-[#E3E2E7] rounded-lg disabled:opacity-50"
          >
            <CgSoftwareUpload className="text-xl mr-2" />
            {uploading ? "Uploading..." : "Upload Avatar"}
          </button>
        </div>
      </div>
    </>
  );
}