import { Link } from "react-router-dom";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FiArchive } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { LuNetwork } from "react-icons/lu";

export default function OwnedComponents() {
  return (
    <>
      <div className="text-2xl flex place-content-between my-4">
        <div className="flex gap-4 items-center font-[500] leading-7 ">
          <FiArchive className="text-[#4EDEA3]" /> Owned Components
        </div>
        <Link className="capitalize text-[#D8E2FF] font-light">
          view all components
        </Link>
      </div>
      <div className="my-8 ">
        <div className="flex items-center justify-between bg-[#1E1F23] border border-[#2D303A] rounded-lg p-6 my-9">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 flex items-center justify-center bg-[#343538] rounded-lg mr-3">
              <MdOutlineMedicalServices className="text-2xl text-(--tertiary)" />
            </span>

            <div>
              <h3 className="text-2xl font-semibold">Recommendation Service</h3>

              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 text-xs rounded bg-[#111216] border border-[#2D303A]">
                  MICROSERVICE
                </span>

                <span className="px-2 py-1 text-xs rounded bg-[#111216] border border-[#2D303A]">
                  GRPC / GO
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs font-semibold text-(--tertiary)">PROD</p>

              <p className="text-xl text-(--tertiary)">HEALTHY</p>
            </div>

            <IoIosArrowForward className="text-2xl text-gray-400" />
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#1E1F23] border border-[#2D303A] rounded-lg p-6">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 flex items-center justify-center bg-[#343538] rounded-lg mr-3">
              <LuNetwork className="text-(--tertiary) text-2xl" />
            </span>

            <div>
              <h3 className="text-2xl font-semibold">API Gateway</h3>

              <div className="flex gap-2 mt-2">
                <span className="px-2 py-1 text-xs rounded bg-[#111216] border border-[#2D303A]">
                  INGRESS
                </span>

                <span className="px-2 py-1 text-xs rounded bg-[#111216] border border-[#2D303A]">
                  ENVOY
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs font-semibold text-(--tertiary)">PROD</p>

              <p className="text-xl text-(--tertiary)">HEALTHY</p>
            </div>

            <IoIosArrowForward className="text-2xl text-gray-400" />
          </div>
        </div>
      </div>
    </>
  );
}
