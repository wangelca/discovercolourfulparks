"use client";

import { useState } from "react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Header({ user, isSignedIn }) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white">
      <nav className="border-green-900 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex justify-between items-center md:justify-between mx-auto max-w-screen-xl">
          {/* Logo Section */}
          <a href="/" className="flex flex-col items-center mb-2 md:mb-0">
            <Image
              src="/DCP-logo-whitebg.png"
              width={200} // Adjust width if necessary for better small screen display
              height={80}
              alt="Logo"
              priority
              className="h-auto w-auto"
            />
          </a>

          {/* Right-side Section: Sign-In / User + Hamburger */}
          <div className="flex items-center ml-auto lg:hidden">
            {/* Hamburger Menu (mobile) */}
            <button
              onClick={handleMenuToggle}
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-6 h-6 ${isMobileMenuOpen ? "hidden" : "block"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className={`w-6 h-6 ${isMobileMenuOpen ? "block" : "hidden"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          {/* Desktop Links + Sign In/User */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8 lg:ml-auto">
            <a href="/parks" className="text-lg font-bold hover:text-green-700">
              Parks
            </a>
            <a href="/events" className="text-lg font-bold hover:text-green-700">
              Events
            </a>
            <a href="/spots" className="text-lg font-bold hover:text-green-700">
              Spots
            </a>
            <a href="/fees" className="text-lg font-bold hover:text-green-700">
              Admissions
            </a>
            <a href="/aboutus" className="text-lg font-bold hover:text-green-700">
              About Us
            </a>
            <a href="/itinerary" className="text-lg font-bold hover:text-green-700">
              Itinerary
            </a>
            {/* Sign in / User button (Desktop) */}
            <div>
              {!isSignedIn ? (
                <SignInButton redirectUrl="/" mode="modal">
                  <button className="bg-green-800 text-white text-xl font-semibold py-1.5 px-4 rounded-full transition hover:bg-green-700">
                    Sign In
                  </button>
                </SignInButton>
              ) : (
                <UserButton
                  appearance={{
                    userButtonPopoverActionButton:
                      "bg-slate-500 hover:bg-slate-400 text-xl",
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-2">
            <ul className="flex flex-col space-y-2 text-xl font-bold">
              <li>
                <a href="/parks" className="block px-4 py-2 hover:bg-gray-100">
                  Parks
                </a>
              </li>
              <li>
                <a href="/events" className="block px-4 py-2 hover:bg-gray-100">
                  Events
                </a>
              </li>
              <li>
                <a href="/spots" className="block px-4 py-2 hover:bg-gray-100">
                  Spots
                </a>
              </li>
              <li>
                <a href="/fees" className="block px-4 py-2 hover:bg-gray-100">
                  Admissions
                </a>
              </li>
              <li>
                <a href="/aboutus" className="block px-4 py-2 hover:bg-gray-100">
                  About Us
                </a>
              </li>
              <li>
                <a href="/itinerary" className="block px-4 py-2 hover:bg-gray-100">
                  Itinerary
                </a>
              </li>
            </ul>
            <div className="px-4 py-2">
              {!isSignedIn ? (
                <SignInButton redirectUrl="/" mode="modal">
                  <button className="w-full bg-green-800 text-white text-xl font-semibold py-1.5 rounded-full transition hover:bg-green-700">
                    Sign In
                  </button>
                </SignInButton>
              ) : (
                <UserButton
                  appearance={{
                    userButtonPopoverActionButton:
                      "bg-slate-500 hover:bg-slate-400 text-xl",
                  }}
                />
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
