import { useState } from "react";
import ProfileHeader from "../../components/profileSettings/ProfileHeader";
import StatsSection from "../../components/profileSettings/StatsSection";
import PersonalInfo from "../../components/profileSettings/PersonalInfo";
import Access from "../../components/profileSettings/Access"
import NotificationPrefrencs from "../../components/profileSettings/NotificationPrefrencs";
export default function ProfileSettings() {
   const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="mx-25 my-12 w-full">
        <ProfileHeader 
         isEditing={isEditing}
        onEditToggle={() => setIsEditing((prev) => !prev)}
        />
        <StatsSection />
        <div className="grid grid-cols-2 gap-20">
          <div className="">
            <PersonalInfo
              key={isEditing ? "editing" : "viewing"}
            isEditing={isEditing}
            onCancel={() => setIsEditing(false)}
            onSaved={() => setIsEditing(false)}
             />
          </div>
          <div>
            <Access />
          </div>
        </div>
        <div className="my-15">
          <NotificationPrefrencs/>
        </div>
        
      </div>
    </>
  );
}
