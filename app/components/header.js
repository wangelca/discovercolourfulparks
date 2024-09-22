'use client';

import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

export default function Header() {
  const { isSignedIn } = useUser(); // Check if the user is signed in

  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <div className="text-3xl font-extrabold text-gray-800">
          <a href="/">Discover Colourful Parks</a> 
        </div>
        
        <nav className="hidden md:flex flex-grow justify-center space-x-8">
          <a href="/parks" className="text-gray-700 hover:text-gray-900 transition">Parks</a>
          <a href="/events" className="text-gray-700 hover:text-gray-900 transition">Events</a>
          <a href="/spots" className="text-gray-700 hover:text-gray-900 transition">Spots</a>
          <a href="/fees" className="text-gray-700 hover:text-gray-900 transition">Fees</a>
          <a href="/aboutus" className="text-gray-700 hover:text-gray-900 transition">About Us</a>
        </nav>

        <div>
          {!isSignedIn ? (
            <SignInButton redirectUrl="/">
              <button className="bg-black text-white font-semibold py-2 px-4 rounded-full transition hover:bg-gray-700">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <SignOutButton>
              <button className="bg-black text-white font-semibold py-2 px-4 rounded-full transition hover:bg-gray-700">
                Sign Out
              </button>
            </SignOutButton>
          )}
        </div>
      </div>
    </header>
  );
}
