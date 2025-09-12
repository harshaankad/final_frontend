'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Patients', href: '/patients' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setIsLoggedIn(false);
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <Disclosure as="nav" className="bg-[#285430] shadow-lg relative">
      <div className="mx-auto max-w-[85rem] px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-[#ffffff] transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6 group-data-open:hidden transition-transform duration-200" aria-hidden="true" />
              <XMarkIcon className="hidden h-6 w-6 group-data-open:block transition-transform duration-200 group-data-open:rotate-90" aria-hidden="true" />
            </DisclosureButton>
          </div>

          {/* Logo and nav links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                className="h-8 w-auto invert transition-all duration-700 ease-in-out hover:scale-110 hover:rotate-360 cursor-pointer"
                src="/logo.png"
                alt="Logo"
              />
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href} passHref legacyBehavior>
                    <a
                      className={classNames(
                        'text-gray-300 hover:text-[#ffffff] text-sm px-3 py-2 rounded-md font-medium relative overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 group'
                      )}
                    >
                      <span className="relative z-10">{item.name}</span>
                      {/* Hover background effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      {/* Bottom border animation */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 ease-in-out group-hover:w-full"></div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Login/Logout Button */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-gray-300 border border-gray-300 px-3 py-1 rounded text-sm transition-all duration-300 ease-in-out hover:text-[#ffffff] hover:border-[#ffffff] hover:scale-105 hover:shadow-lg hover:shadow-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 relative overflow-hidden group"
              >
                <span className="relative z-10">Logout</span>
                <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></div>
              </button>
            ) : (
              <button
                onClick={handleLogin}
                className="text-gray-300 border border-gray-300 px-3 py-1 rounded text-sm transition-all duration-300 ease-in-out hover:text-[#ffffff] hover:border-[#ffffff] hover:scale-105 hover:shadow-lg hover:shadow-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 relative overflow-hidden group"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out origin-left"></div>
              </button>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden transform transition-all duration-300 ease-in-out data-[closed]:-translate-y-full data-[closed]:opacity-0 data-[open]:translate-y-0 data-[open]:opacity-100">
        <div className="space-y-1 px-2 pt-2 pb-3 bg-[#285430]/95 backdrop-blur-sm">
          {navigation.map((item, index) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              href={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-[#ffffff] transition-all duration-300 ease-in-out hover:translate-x-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 relative overflow-hidden group"
              style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slideInFromLeft 0.5s ease-out forwards'
              }}
            >
              <span className="relative z-10">{item.name}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>

      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </Disclosure>
  );
}