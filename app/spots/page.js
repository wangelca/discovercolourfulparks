'use client';

import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { useState } from 'react';

export default function Home() {
  const { isSignedIn } = useUser();
  const [activeFilter, setActiveFilter] = useState('Popular Spots');

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const descriptions = {
    'Popular Spots': "A combination of the two, visit the most popular spots in Canada's National Parks.",
    'Activities': "From golfing to camping and picnics and much more, explore these spots and add them to your itinerary for your next visit!",
    'Sites and Attractions': "From lakes to landmarks, explore the beautiful landscape of Canada's National Parks!"
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-white">
      <header className="bg-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-3xl font-extrabold text-gray-800">
            Discover Colourful Parks
          </div>
          
          <nav className="hidden md:flex flex-grow justify-center space-x-8">
            <a href="/parks" className="text-gray-700 hover:text-gray-900 transition">Parks</a>
            <a href="/events" className="text-gray-700 hover:text-gray-900 transition">Events</a>
            <a href="/spots" className="text-gray-700 hover:text-gray-900 transition">Spots</a>
            <a href="/" className="text-gray-700 hover:text-gray-900 transition">Fees</a>
            <a href="/" className="text-gray-700 hover:text-gray-900 transition">About Us</a>
          </nav>

          <div>
            {!isSignedIn ? (
              <SignInButton redirectUrl="/login">
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

      <div className="relative w-screen flex justify-center py-12">
        <div className="relative w-full max-w-screen-xl">
          <img
            src="/spots_banner.jpg"
            alt="Spots Banner"
            className="w-full h-auto object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-4">
            <div className="flex space-x-4">
              <button
                onClick={() => handleFilterChange('Popular Spots')}
                className={`text-xl font-bold py-2 px-4 rounded-full transition ${activeFilter === 'Popular Spots' ? 'bg-black text-white' : 'bg-white text-gray-700'} hover:bg-gray-700`}
              >
                Popular Spots
              </button>
              <button
                onClick={() => handleFilterChange('Activities')}
                className={`text-xl font-bold py-2 px-4 rounded-full transition ${activeFilter === 'Activities' ? 'bg-black text-white' : 'bg-white text-gray-700'} hover:bg-gray-300`}
              >
                Activities
              </button>
              <button
                onClick={() => handleFilterChange('Sites and Attractions')}
                className={`text-xl font-bold py-2 px-4 rounded-full transition ${activeFilter === 'Sites and Attractions' ? 'bg-black text-white' : 'bg-white text-gray-700'} hover:bg-gray-300`}
              >
                Sites and Attractions
              </button>
            </div>
            <p className="text-white text-lg text-center max-w-lg">{descriptions[activeFilter]}</p>
          </div>
        </div>
      </div>
    </div>
  );
}








'use client';

import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

export default function Home() {
  const { isSignedIn } = useUser(); // Check if the user is signed in

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-3xl font-extrabold text-gray-800">
            Discover Colourful Parks
          </div>
          
          <nav className="hidden md:flex flex-grow justify-center space-x-8">
            <a href="/parks" className="text-gray-700 hover:text-gray-900 transition">Parks</a>
            <a href="/" className="text-gray-700 hover:text-gray-900 transition">Events</a>
            <a href="/" className="text-gray-700 hover:text-gray-900 transition">Spots</a>
            <a href="/" className="text-gray-700 hover:text-gray-900 transition">Fees</a>
            <a href="/" className="text-gray-700 hover:text-gray-900 transition">About Us</a>
          </nav>

          <div>
            {!isSignedIn ? (
              <SignInButton redirectUrl="/login">
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
    </div>
  );
}