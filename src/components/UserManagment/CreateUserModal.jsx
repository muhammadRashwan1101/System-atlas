import { BiInfoCircle } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
import { IoEyeOutline, IoRefreshOutline } from "react-icons/io5";
import { useState } from "react";
export default function CreateUserModal() {
  const [option, setOption] = useState("send");
  return (
    <>
      <div className="  flex justify-center  items-center   ">
        <div className="w-2/5  overflow-hidden border border-[#2D303A] rounded-xl my-10">
          <div className="relative bg-[#292A2D4D]  p-6 border-b border-[#2D303A]">
            <div className="text-lg text-[#E3E2E7]">Create New User</div>
            <div className="text-[#C4C6D0] text-sm">
              Create a new user account and generate initial credentials.
            </div>
            <IoIosClose className="absolute right-4 top-4 text-4xl" />
          </div>
          <div className="bg-[#191B23]  p-6 ">
            <div className="flex items-center gap-4">
              <h2 className="text-[#D8E2FF] text-sm font-mono whitespace-nowrap">
                PERSONAL INFORMATION
              </h2>
              <div className="flex-1 h-px bg-[#2D303A]"></div>
            </div>

            <div className="py-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-xs font-mono uppercase text-[#C4C6D0]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="shahd khairy"
                    className="w-full rounded-lg border border-(--border) bg-(--secondary-bg) px-4 py-2 text-(--text) placeholder:text-slate-500 outline-none focus:border-(--primary) transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-xs font-mono uppercase text-[#C4C6D0]">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="shahd_khairy"
                    className="w-full rounded-lg border border-(--border) bg-(--secondary-bg) px-4 py-2 text-(--text) placeholder:text-slate-500 outline-none focus:border-(--primary) transition-colors text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block mb-2 text-xs font-mono uppercase text-[#C4C6D0]">
                    Work Email
                  </label>
                  <input
                    type="email"
                    placeholder="shahd@gmail.com"
                    className="w-full rounded-lg border border-(--border) bg-(--secondary-bg) px-4 py-2 text-(--text) placeholder:text-slate-500 outline-none focus:border-(--primary) transition-colors text-sm"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 mt-6 mb-3">
                <h2 className="text-[#D8E2FF] text-sm font-mono whitespace-nowrap">
                  ROLE & ACCESS
                </h2>
                <div className="flex-1 h-px bg-[#2D303A]"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-mono text-[#C4C6D0]">
                    Role
                  </label>
                  <select className="w-full text-sm rounded-md border border-[#2D303A] bg-[#0D0E11] px-4 py-2 text-[#E3E2E7] outline-none focus:border-[#5B8CFF]">
                    <option>Developer</option>
                    <option>Admin</option>
                    <option>Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-mono text-[#C4C6D0]">
                    Level
                  </label>
                  <select className="w-full text-sm rounded-md border border-[#2D303A] bg-[#0D0E11] px-4 py-2 text-[#E3E2E7] outline-none focus:border-[#5B8CFF]">
                    <option>Senior</option>
                    <option>Mid</option>
                    <option>Junior</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-mono text-[#C4C6D0]">
                    Workspace
                  </label>
                  <select className="w-full text-sm rounded-md border border-[#2D303A] bg-[#0D0E11] px-4 py-2 text-[#E3E2E7] outline-none focus:border-[#5B8CFF]">
                    <option>Global Engineering</option>
                    <option>Marketing</option>
                    <option>HR</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-mono text-[#C4C6D0]">
                    Team Assignment{" "}
                    <span className="text-[#6C7383]">(Optional)</span>
                  </label>
                  <select className="w-full text-sm rounded-md border border-[#2D303A] bg-[#0D0E11] px-4 py-2 text-[#E3E2E7] outline-none focus:border-[#5B8CFF]">
                    <option>Select a team...</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-6 mb-3">
                <h2 className="text-[#D8E2FF] text-sm font-mono whitespace-nowrap">
                  INITIAL CREDENTIALS
                </h2>
                <div className="flex-1 h-px bg-[#2D303A]"></div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-mono text-[#C4C6D0]">
                  Temporary Password
                </label>

                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      className="w-full rounded-md border border-[#2D303A] bg-white px-4 py-2 pr-12 text-[#1F2937] placeholder:text-[#C4C6D0] outline-none"
                    />

                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8BCC8]"
                    >
                      <IoEyeOutline size={22} />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-md border border-[#2D303A] px-4 py-2 text-[#D8E2FF] hover:bg-[#191B23] transition"
                  >
                    <IoRefreshOutline size={18} />
                    Generate
                  </button>
                </div>

                <label className="mt-5 flex items-center gap-3 text-[#E3E2E7] cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-5 w-5 rounded accent-[#A7C4FF]"
                  />
                  <span>Require password reset on first login</span>
                </label>
              </div>
              <div className="flex items-center gap-4 mt-6 mb-3">
                <h2 className="text-[#D8E2FF] text-sm font-mono whitespace-nowrap">
                  ACCOUNT STATUS
                </h2>
                <div className="flex-1 h-px bg-[#2D303A]"></div>
              </div>

              <div className="space-y-6 my-8">
                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="invitation"
                    value="send"
                    checked={option === "send"}
                    onChange={(e) => setOption(e.target.value)}
                    className="mt-1 h-5 w-5 accent-[#A7C4FF]"
                  />

                  <div>
                    <h3 className="text-[17px] text-[#E3E2E7]">
                      Send Invitation Immediately
                    </h3>
                    <p className="text-sm text-[#9EA3B3]">
                      User will receive an onboarding email at the provided
                      address.
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-4 cursor-pointer">
                  <input
                    type="radio"
                    name="invitation"
                    value="pending"
                    checked={option === "pending"}
                    onChange={(e) => setOption(e.target.value)}
                    className="mt-1 h-5 w-5 accent-[#A7C4FF]"
                  />

                  <div>
                    <h3 className="text-[17px] text-[#E3E2E7]">
                      Save User Without Sending Invitation
                    </h3>
                    <p className="text-sm text-[#9EA3B3]">
                      Account will be created as "Pending". You can invite later
                      manually.
                    </p>
                  </div>
                </label>
              </div>

              <div className="grid  grid-cols-10  border border-[#2D303A] bg-[#292A2D80] p-6">
                <BiInfoCircle className="col-span-1 text-2xl text-[#ADC6FF]" />
                <div className="col-span-9 text-[#C4C6D0] text-sm">
                  Users receive an email invitation to activate their account.
                  Their temporary password will only be valid until first login.
                  Active sessions will be logged in the system audit trail.
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#0D0E11] p-6 flex items-center justify-between font-mono text-xs border-t border-[#2D303A]">
            <button type="button" className="text-[#FF8A80] hover:text-[#FF8A80]/80 uppercase font-semibold cursor-pointer">
              Cancel
            </button>
            <div className="flex gap-3">
              <button type="button" className="border border-[#2D303A] text-slate-300 hover:text-white hover:bg-white/5 py-2.5 px-4 rounded-lg font-medium transition-colors cursor-pointer">
                Create User
              </button>
              <button type="button" className="text-(--text-primary) bg-(--primary) hover:bg-[#ccdaff] font-semibold py-2.5 px-4 rounded-lg shadow-[0_0_12px_rgba(173,198,255,0.3)] transition-all cursor-pointer">
                Create & Send Invitation
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
