import { FaGithub, FaLinkedin } from "react-icons/fa";

const links = [
    {
        name: "documentation",
        to: "docs",
        current: false,
    },
    {
        name: "API Reference",
        to: "api-doc",
        current: false,
    },
    {
        name: "Privacy Policy",
        to: "policy",
        current: false,
    },
    {
        name: "Terms of Service",
        to: "terms",
        current: false,
    }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function Footer() {
  return (
    <>
      <footer className="border-t border-[#1E222B] bg-[#0A0B0D]">
        <div className="flex flex-col md:flex-row items-center justify-between px-5 sm:px-12 lg:px-20 py-6 text-gray-400 text-sm gap-6">
          <div className="flex flex-col items-start text-start max-w-[45ch] gap-1.5 text-xs">
            <h2 className="font-(family-name:--labels) text-white font-semibold tracking-wider uppercase text-xs">
              System Atlas
            </h2>
            <p className="text-slate-400 font-light text-[11px] leading-relaxed">
              © 2026 System Atlas. All rights reserved. Infrastructure intelligence for hyper-scale systems.
            </p>
          </div>
          <div className="flex gap-2 items-center justify-center flex-wrap">
            {links.map((link) => (
              <a
                key={link.name}
                href={link.to}
                className="font-(family-name:--body-font) text-xs text-slate-400 hover:text-(--primary) px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all duration-150 capitalize"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="flex gap-4 items-center justify-center">
            <FaGithub className="text-xl text-slate-400 hover:text-(--primary) hover:scale-110 transition-all duration-150 cursor-pointer" />
            <FaLinkedin className="text-xl text-slate-400 hover:text-(--primary) hover:scale-110 transition-all duration-150 cursor-pointer" />
          </div>
        </div>
      </footer>
    </>
  );
}
