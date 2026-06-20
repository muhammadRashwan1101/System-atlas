import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import logo from "../../assets/Container.png"
const navigation = [
  { name: 'Explorer', href: '#', current: true },
  { name: 'Archeticture', href: '#', current: false },
  { name: 'Documentation', href: '#', current: false },
  { name: 'About', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  return (
    <Disclosure
      as="nav"
      className="relative bg-(--neutral) after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      <div className="px-5 sm:px-12 lg:px-20 py-1 text-sm">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div clasName="flex items-center ">
              <div className="flex shrink-0 items-center bg-[#ADC6FF] p-2 rounded me-10">
              <img
                alt="Your Company"
                src={logo}
                className="h-5 w-auto"
                />
              </div>
              {/* <h1>System Atlas</h1> */}
              </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4 items-center justify-center h-full">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className= 'text-gray-300 rounded-md px-3 py-2 font-(family-name:--body-font) text-sm transition-colors duration-200  hover:text-white'
                    
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="btn relative rounded-full p-1 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">Sign in</span>
              Sign in
            </button>

            <button
                type="button"
                className="btn relative ms-3 bg-white py-2 px-3 text-(--secondary) font-semibold rounded transition-colors duration-200 hover:bg-white/85"
            >
                New Provision Account
            </button> 
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current ? 'bg-gray-950/50 text-white font-(family-name:--body-font)' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                'block rounded-md px-3 py-2 text-base font-(family-name:--body-font)',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
