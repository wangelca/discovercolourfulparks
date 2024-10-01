"use client";

import { useState } from "react";
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
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
              width={323}
              height={162}
              alt="Logo"
              href="/"
            />
          </a>
          <div className="flex items-center lg:order-2">
            <div>
              {!isSignedIn ? (
                <SignInButton redirectUrl="/">
                  <button className="bg-green-800 text-white text-xl font-semibold py-2.5 px-6 rounded-full transition hover:bg-gray-700 mx-2">
                    Sign In
                  </button>
                </SignInButton>
              ) : (
                <SignOutButton>
                  <button className="bg-black text-white text-xl font-semibold py-2.5 px-6 rounded-full transition hover:bg-gray-700">
                    Sign Out
                  </button>
                </SignOutButton>
              )}
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
            <ul className="flex flex-col mt-4 text-xl font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>  
                <a
                  href="/parks"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Parks
                </a>
              </li>
              <li>
                <a
                  href="/events"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="/spots"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Spots
                </a>
              </li>
              <li>
                <a
                  href="/fees"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Admissions
                </a>
              </li>
              <li>
                <a
                  href="/aboutus"
                  className="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  About Us
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
