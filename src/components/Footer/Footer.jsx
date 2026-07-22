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
    <footer>
        <div className="flex items-center justify-between px-5 sm:px-12 lg:px-20 py-3 bg-(--neutral) text-gray-400 text-sm text-center">
            <div className="flex flex-col items-start text-start max-w-[40ch] gap-3 text-xs">
                <h2 className="font-(family-name:--labels)">System Atlas</h2>
                <p>© 2026 System Atlas. All rights reserved. Infrastructure intelligence for hyper-scale systems.</p>
            </div>
            <div className="flex gap-3 items-center justify-center h-full">
                {links.map((link) => (
                    <a 
                    key={link.name}
                    href={link.href}
                    aria-current={link.current ? 'page' : undefined}
                    className={`font-(family-name:--body-font) text-md capitalize cursor-pointer ${classNames(
                      link.current ? 'bg-gray-950/50 text-white ' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                      'rounded-md px-3 py-2',)}`}
                    >
                        {link.name}
                    </a>
                ))}
            </div>
            <div className="flex gap-5 items-center justify-center h-full">
                <FaGithub className="text-3xl text-center hover:text-white cursor-pointer"/>
                <FaLinkedin className="text-3xl text-center hover:text-white cursor-pointer"/>
            </div>
        </div>
    </footer>
    </>
  )
}
