"use client";

import { useState } from "react";
import {
  useUser,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";

export default function Header() {
  const { isSignedIn } = useUser(); // Check if the user is signed in
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg">
      <nav className="bg-white border-green-900 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <a href="/" className="flex items-center">
            <Image
              src="/DCP-logo-whitebg.png"
              width={280}
              height={125}
              alt="Logo"
              href="/"
            />
          </a>
          <div className="flex items-center lg:order-2">
            <div>
              {!isSignedIn ? (
                <SignInButton redirectUrl="/" mode='modal'> 
                  <button className="bg-green-800 text-white text-xl font-semibold py-2.5 px-6 rounded-full transition hover:bg-gray-700 mx-2">
                    Sign In
                  </button>
                </SignInButton>
              ) : (
                <UserButton
                  appearance={{
                    userButtonPopoverActionButton:
                      "bg-slate-500 hover:bg-slate-400 text-sm",
                  }}
                />               
              ) }
            </div>
            <button
              onClick={handleMenuToggle} // Toggle menu on click
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              aria-controls="mobile-menu-2"
              aria-expanded={isMobileMenuOpen} // Reflect the state in aria-expanded
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-6 h-6 ${isMobileMenuOpen ? "hidden" : "block"}`} // Show only when menu is closed
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
                className={`w-6 h-6 ${isMobileMenuOpen ? "block" : "hidden"}`} // Show only when menu is open
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
          <div
            className={`${
              isMobileMenuOpen ? "block" : "hidden"
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 text-xl font-bold lg:flex-row lg:space-x-8 lg:mt-0">
              <li className="text-lg group relative w-max">
                <a href="/parks">
                  <span>Parks</span>
                  <span className="absolute -bottom-1 left-0 w-0 transition-all h-1 bg-indigo-600 group-hover:w-full"></span>
                </a>
              </li>
              <li className="text-lg group relative w-max">
                <a href="/events">
                  <span>Events</span>
                  <span className="absolute -bottom-1 left-0 w-0 transition-all h-1 bg-blue-600 group-hover:w-full"></span>
                </a>
              </li>
              <li className="text-lg group relative w-max">
                <a href="/spots">
                  <span>Spots</span>
                  <span className="absolute -bottom-1 left-0 w-0 transition-all h-1 bg-green-600 group-hover:w-full"></span>
                </a>
              </li>
              <li className="text-lg group relative w-max">
                <a href="/fees">
                  <span>Admissions</span>
                  <span className="absolute -bottom-1 left-0 w-0 transition-all h-1 bg-orange-400 group-hover:w-full"></span>
                </a>
              </li>
              <li className="text-lg group relative w-max">
                <a href="/aboutus">
                  <span>About Us</span>
                  <span className="absolute -bottom-1 left-0 w-0 transition-all h-1 bg-red-300 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

{
  /*Ref: https://flowbite.com/blocks/marketing/header/ */
}
{
  /*ChatGPT prompt:please draft the next.js code for mobile menu*/
}


