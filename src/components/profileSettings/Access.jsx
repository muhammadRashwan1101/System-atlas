import { BiCheckCircle } from "react-icons/bi";
import { BsKey } from "react-icons/bs";
import { CgCloseO } from "react-icons/cg";
import useMyProfile from "../../hooks/useMyProfile";

export default function Access() {
  const permissions = [
    { id: 1, name: "Create Components" },
    { id: 2, name: "Edit Components" },
    { id: 3, name: "Delete Components" },
    { id: 4, name: "Manage Teams" },
    { id: 5, name: "Manage Users" },
    { id: 6, name: "Create Workspaces" },
  ];
  const { user, loading, error } = useMyProfile();
  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-700">{error}</p>;
  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    <>
      <div className="flex items-center gap-3 mb-10">
        <BsKey className="text-[#D8E2FF] text-4xl" />
        <h2 className="text-2xl font-medium text-[#E3E2E7]">
          Access & Permissions
        </h2>
      </div>

      <div className="bg-[#1E1F23] border border-[#2D303A] rounded-2xl p-10">
        <div className="flex justify-between border-b border-[#2D303A] pb-6">
          <p className="text-xl">Current Role:</p>
          <p className="text-[#D8E2FF] border border-[#D8E2FF33] rounded-full bg-[#3a3c44] py-1.5 px-4 text-sm">
            {user.role}
          </p>
        </div>
        <div className="my-12">
          {permissions.map((perm, index) => {
            const isGranted = isAdmin || index === 0;
            return (
              <div key={perm.id} className="flex justify-between my-8">
                <p className="text-[#E3E2E7]">{perm.name}</p>
                {isGranted ? (
                  <BiCheckCircle className="text-[#4EDEA3]" />
                ) : (
                  <CgCloseO className="text-red-500" />
                )}
              </div>
            );
          })}
        </div>
        <footer className="text-[#C4C6D0]  font-['JetBrains_Mono'] font-normal text-[12px] leading-3.5 tracking-[1px] align-middle">
          Governance Matrix ID: GVM-2023-A-CHX
        </footer>
      </div>
    </>
  );
}