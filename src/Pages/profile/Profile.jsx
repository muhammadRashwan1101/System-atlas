import Activity from "../../components/Profile/Activity";
import Cards from "../../components/Profile/Cards";
import OwnedComponents from "../../components/Profile/OwnedComponents";
import RightSide from "../../components/Profile/RightSide";
import UserInfo from "../../components/Profile/userInfo";

export default function Profile() {
  return (
    <>
      <div className="my-6 mx-10">
        <UserInfo />

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 my-10 mb-15">
          <Cards />
        </div>
        <div className="grid grid-cols-10 gap-16 ">
          <div className=" col-span-6">
            <OwnedComponents />
            <Activity />
          </div>
          <div className=" col-span-4 flex gap-6 flex-col">
            <RightSide />
          </div>
        </div>
      </div>
    </>
  );
}
