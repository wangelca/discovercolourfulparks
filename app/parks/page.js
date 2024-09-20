'use client';

import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
import { useState } from 'react';

export default function Home() {
  const { isSignedIn } = useUser(); // Check if the user is signed in

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Alberta');
  const [filterOption, setFilterOption] = useState('alphabetical');

  // List of parks for Alberta until we can connect the PostgreSQL database (just a skeleton for now) and description from Parks Canada
  const parks = {
    Alberta: [
      { name: 'Banff National Park', description: 'The natural beauty of Banffs surrounding lakes and mountains made it Canadas first National Park and the worlds third national park refuge, and part of the Canadian Rocky Mountain Parks UNESCO World Heritage Site. More than 4 million people from around the world now visit Banff National Park every year.', image: '/banff_parks.jpg' },
      { name: 'Jasper National Park', description: 'Spanning over 11,000 square kilometers, Jasper is the largest national park in the Canadian Rockies. Known for its vast wilderness, majestic peaks, abundant wildlife, and outstanding beauty, visitors from all over Canada and round the world travel here to experience this very special place.', image: '/jasper_parks.jpg' },
      { name: 'Elk Island National Park', description: 'Elk Island is home to the densest population of ungulates (hoofed mammals) in Canada. A variety of mammal species including coyote, bison, moose, mule deer, lynx, beaver, elk, white-tailed deer, and porcupine are year round residents.', image: '/elkisland_parks.jpg' },
      { name: 'Waterton Lakes National Park', description: 'The prairies of Alberta meet the peaks of the Rocky Mountains in Waterton Lakes National Park. Clear lakes, thundering waterfalls, rainbow-coloured streams, colourful rocks, and mountain vistas await hikers and sightseers. Waterton packs a big natural punch into a relatively small and accessible area.', image: '/waterton_parks.jpg' },
    ],
  };

  const filteredParks = parks[selectedProvince].filter(park =>
    park.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-3xl font-extrabold text-gray-800">
            Discover Colourful Parks
          </div>
          
          <nav className="hidden md:flex flex-grow justify-center space-x-8">
            <a href="/parks" className="text-gray-700 hover:text-gray-900 transition">Parks</a>
            <a href="/events" className="text-gray-700 hover:text-gray-900 transition">Events</a>
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

      <main className="container mx-auto px-6 py-12 flex flex-col">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Find a Park</h1>

        <div className="flex items-center mb-6">
          <input
            type="text"
            placeholder="Search parks..."
            className="p-2 border border-gray-300 rounded-md flex-grow text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="ml-4">
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-gray-900"
            >
              <option value="alphabetical">Filter Alphabetically</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Provinces and Territories</h2>
          <div className="flex flex-wrap gap-2">
            {['Alberta', 'British Columbia'].map(province => (
              <button
                key={province}
                onClick={() => setSelectedProvince(province)}
                className={`p-2 border border-gray-300 rounded-md ${selectedProvince === province ? 'bg-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                {province}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredParks.map((park, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden flex">
              <img
                src={park.image}
                alt={park.name}
                className="w-1/3 h-auto object-cover"
              />
              <div className="p-4 w-2/3">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{park.name}</h3>
                <p className="text-gray-700 mb-4">{park.description}</p>
                <a href={`/parks/banff`} className="text-blue-600 hover:underline">View Park</a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}













