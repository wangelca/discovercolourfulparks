'use client';

import { useState } from 'react';

export default function Home() {
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
                onClick={() => handleFilterChange('Popular Spots')
                }
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
            {/*TO remove  after testing*/}
            <div className="text-3xl font-extrabold text-white">
          <a href="/spots/spots-list">Testing spot list</a> 
        </div>
            <p className="text-white text-lg text-center max-w-lg">{descriptions[activeFilter]}</p>
          </div>
        </div>
      </div>
    </div>
    
  );
}