import {FaRegCirclePlay} from 'react-icons/fa6';
import { Link } from "react-router-dom"


export default function HeroSection() {
  return (
    <>
      <div className="flex flex-col items-center justify-center text-white text-center gap-10 mx-auto max-w-[80ch] pt-20 px-5 relative z-10">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="h-[320px] w-[900px] relative -top-30 rounded-full bg-[#ADC6FF]/10 blur-[100px]"></div>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold font-(family-name:--headlines) leading-tight text-white tracking-tight">
            Visualize Services.{" "}
            <span className="text-5xl md:text-6xl font-bold font-(family-name:--headlines) bg-gradient-to-r from-[#ADC6FF] via-[#89B4FA] to-[#4EDEA3] text-transparent bg-clip-text">
              Understand Dependencies.
            </span>{" "}
            Predict Impact.
          </h1>
        </div>
        <p className="max-w-[60ch] text-(--text) text-base md:text-lg leading-relaxed font-light">
          The intelligence layer for your cloud infrastructure. Map relationships between every service, API, and database to eliminate architectural blind spots.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/login"
            className="px-7 py-3 text-sm font-semibold uppercase tracking-wider text-(--text-primary) bg-(--primary) rounded-xl shadow-[0_0_20px_rgba(173,198,255,0.3)] hover:bg-[#ccdaff] hover:shadow-[0_0_25px_rgba(173,198,255,0.5)] transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
          >
            Start Mapping Free
          </Link>
          <Link
            to="/login"
            className="flex gap-2.5 items-center px-6 py-3 border border-(--border)/60 bg-[#161B22] text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            <FaRegCirclePlay className="text-sm text-(--primary)" />
            Explore Platform
          </Link>
        </div>
      </div>
    </>
  );
}
