import { useLocation, useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/profileSettings/ProfileHeader";
import StatsSection from "../../components/profileSettings/StatsSection";
import PersonalInfo from "../../components/profileSettings/PersonalInfo";
import Access from "../../components/profileSettings/Access";
import NotificationPrefrencs from "../../components/profileSettings/NotificationPrefrencs";
import useMyProfile from "../../hooks/useMyProfile.js";
import Authentication from "../../components/profileSettings/Authentication.jsx";


export default function ProfileSettings() {
  const location = useLocation();
  const navigate = useNavigate();
  const profile = useMyProfile();
  const isEditing = location.pathname.endsWith("/edit");

  const goToView = () => navigate("/profile-settings");
  const goToEdit = () => navigate("/profile-settings/edit");

  return (
    <>
      <div className="mx-25 my-12 w-full">
        <ProfileHeader
          {...profile}
          isEditing={isEditing}
          onEditToggle={() => (isEditing ? goToView() : goToEdit())}
        />
        <StatsSection />
        <div className="grid grid-cols-2 gap-20">
          <div>
            <PersonalInfo
              {...profile}
              key={isEditing ? "editing" : "viewing"}
              isEditing={isEditing}
              onCancel={goToView}
              onSaved={goToView}
            />
          </div>
          <div>
            <Access />
          </div>
        </div>
        <div className="my-15">
          <NotificationPrefrencs />
        </div>
       <Authentication/>
      </div>
    </>
  );
}
