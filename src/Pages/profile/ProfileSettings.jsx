import ProfileHeader from "../../components/profileSettings/ProfileHeader";
import StatsSection from "../../components/profileSettings/StatsSection";
import PersonalInfo from "../../components/profileSettings/PersonalInfo";
import Access from "../../components/profileSettings/Access"
export default function ProfileSettings() {
  return (
    <>
      <div className="mx-25 my-12 w-full">
        <ProfileHeader />
        <StatsSection />
        <div className="grid grid-cols-2 gap-20">
          <div className="">
            <PersonalInfo />
          </div>
          <div>
            <Access />
          </div>
        </div>
      </div>
    </>
  );
}
