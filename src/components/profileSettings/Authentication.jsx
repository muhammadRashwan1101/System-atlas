import { BiShieldQuarter } from "react-icons/bi";
import { HiOutlineClock } from "react-icons/hi";
import { FiMonitor, FiSmartphone } from "react-icons/fi";
import { GiHeadphones } from "react-icons/gi";
import { HiOutlineQrcode } from "react-icons/hi";

export default function Authentication() {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <BiShieldQuarter className="text-[#D8E2FF] text-3xl" />
        <h2 className="text-2xl font-medium text-[#E3E2E7]">
          Security & Authentication
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col gap-6">
          <div className="bg-[#1E1F23] border border-[#2D303A] rounded-2xl p-6">
            <div className="flex items-center justify-between pb-6 border-b border-[#2D303A]">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 bg-[#4EDEA31A] text-[#4EDEA3] px-5 py-3 rounded-xl">
                  <GiHeadphones className="text-2xl" />
                  <span className="uppercase font-semibold tracking-wide text-lg">
                    Authenticator
                  </span>
                </div>
                <div className="text-[#E3E2E7]">
                  <p className="font-medium">Multi-Factor Authentication</p>
                  <p className="font-medium mb-1">(MFA)</p>
                  <p className="text-[#4EDEA3] text-sm">
                    Active • Hardware Key (YubiKey)
                  </p>
                </div>
              </div>
              <button className="bg-[#2A2B31] text-[#9CA0AA] text-sm px-5 py-2.5 rounded-lg cursor-not-allowed">
                Enable MFA
              </button>
            </div>

            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-4">
                <div className="border border-[#3A3B42] rounded-full p-2.5 text-[#9CA0AA]">
                  <HiOutlineClock className="text-xl" />
                </div>
                <div className="text-[#E3E2E7]">
                  <p className="font-medium">Last Password Change</p>
                  <p className="text-sm text-[#9CA0AA]">
                    42 Days Ago (Sept 12, 2023)
                  </p>
                </div>
              </div>
              <button className="bg-[#2A2B31] text-[#E3E2E7] text-sm px-5 py-2.5 rounded-lg">
                Change Password
              </button>
            </div>
          </div>

          <div className="bg-[#1E1F23] border border-[#2D303A] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#2D303A]">
              <p className="text-xs uppercase tracking-widest text-[#9CA0AA]">
                Active Sessions
              </p>
            </div>

            <div className="flex items-center justify-between px-6 py-5 border-b border-[#2D303A]">
              <div className="flex items-center gap-4">
                <FiMonitor className="text-2xl text-[#D8E2FF]" />
                <div>
                  <p className="text-[#E3E2E7] font-medium">
                    MacBook Pro 16" - Chrome
                  </p>
                  <p className="text-sm text-[#9CA0AA]">
                    IP: 192.168.1.104 • San Francisco, US • Current
                  </p>
                </div>
              </div>
              <span className="text-[#4EDEA3] text-sm font-medium">
                CURRENT
              </span>
            </div>

            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                <FiSmartphone className="text-2xl text-[#C4C6D0]" />
                <div>
                  <p className="text-[#E3E2E7] font-medium">
                    iPhone 15 Pro - Safari
                  </p>
                  <p className="text-sm text-[#9CA0AA]">
                    IP: 172.16.0.42 • Los Angeles, US
                  </p>
                </div>
              </div>
              <button className="text-[#F87171] text-sm font-medium hover:underline">
                Terminate
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-1 bg-[#1E1F23] border border-[#2D303A] rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full">
          <div className="bg-[#2A2B31] rounded-2xl p-5 mb-6">
            <HiOutlineQrcode className="text-5xl text-[#D8E2FF]" />
          </div>
          <p className="text-[#E3E2E7] font-medium text-lg mb-3">
            Mobile Access
          </p>
          <p className="text-sm text-[#9CA0AA] mb-8 leading-relaxed max-w-55">
            Scan to authorize your mobile device for secure on-the-go system
            monitoring.
          </p>
          <button className="bg-[#2A2B31] hover:bg-[#33343B] transition-colors text-[#D8E2FF] font-medium text-sm px-5 py-3 rounded-lg w-full">
            Generate Token
          </button>
        </div>
      </div>
    </>
  );
}
