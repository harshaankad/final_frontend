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

// Admin-only links; shown once the stored profile says role === 'admin'.
const adminNavigation = [{ name: 'Analytics', href: '/analytics' }];

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
    try {
      const profile = JSON.parse(localStorage.getItem('doctorData') || 'null');
      setIsAdmin(!!token && profile?.role === 'admin');
    } catch {
      setIsAdmin(false);
    }
  }, []);

  const links = isAdmin ? [...navigation, ...adminNavigation] : navigation;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('doctorData');
    localStorage.removeItem('doctorId');
    setIsLoggedIn(false);
    setIsAdmin(false);
    router.push('/');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const authButtonClass =
    'h-9 px-4 rounded-md text-sm font-medium text-white/90 border border-white/40 ' +
    'transition-colors duration-200 hover:bg-white/10 hover:text-white hover:border-white/70 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60';

  return (
    <Disclosure as="nav" className="bg-[#285430] shadow-md relative">
      <div className="mx-auto max-w-[85rem] px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group inline-flex items-center justify-center rounded-md p-2 text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6 group-data-open:hidden" aria-hidden="true" />
              <XMarkIcon className="hidden h-6 w-6 group-data-open:block" aria-hidden="true" />
            </DisclosureButton>
          </div>

          {/* Logo and nav links */}
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link href="/" className="flex shrink-0 items-center" aria-label="DermaDrishti home">
              <img className="h-7 w-auto invert" src="/logo.png" alt="DermaDrishti" />
            </Link>
            <div className="hidden sm:ml-8 sm:block">
              <div className="flex space-x-2">
                {links.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group relative px-3 py-2 rounded-md text-sm font-medium text-white/80 transition-colors duration-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    {item.name}
                    <span className="absolute left-3 right-3 bottom-1 h-0.5 origin-left scale-x-0 bg-white transition-transform duration-200 group-hover:scale-x-100" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Login/Logout Button */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6">
            {isLoggedIn ? (
              <button onClick={handleLogout} className={authButtonClass}>
                Logout
              </button>
            ) : (
              <button onClick={handleLogin} className={authButtonClass}>
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-3 pt-2 pb-3 border-t border-white/10">
          {links.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              href={item.href}
              className="block rounded-md px-3 py-2 text-base font-medium text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
