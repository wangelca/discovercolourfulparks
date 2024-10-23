'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('Popular Spots');
  const [filteredSpots , setFilteredSpots] = useState([]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const fetchSpots = async (filter) => {
    try {
      const res = await axios.get("http://localhost:8000/spots",
        { headers: {Accept: 'application/json'}, 
        params: { category: filter }},
      );
      console.log(activeFilter, res.data);
      setFilteredSpots(res.data);
      
    } catch (error) {
      console.error("Error fetching data from http://localhost:8000/spots")
    }
    
  }
  
  const descriptions = {
    'Popular Spots': "A combination of the two, visit the most popular spots in Canada's National Parks.",
    'Activities': "From golfing to camping and picnics and much more, explore these spots and add them to your itinerary for your next visit!",
    'Sites and Attractions': "From lakes to landmarks, explore the beautiful landscape of Canada's National Parks!"
  };


  useEffect(() => {
    fetchSpots(activeFilter);
  }, [activeFilter]);

  return (
    <div className="relative flex flex-col min-h-screen bg-white">     
      <div className="relative w-screen flex justify-center py-12">
        <div className="relative w-full max-w-screen-xl border border-black">
          {/* <img
            src="/spots_banner.jpg"
            alt="Spots Banner"
            className="w-full h-auto object-cover rounded-lg"
          /> */}
          <div className='bg-custom-image bg-cover w-full h-screen'>
            <div className="absolute inset-0 rounded-lg">
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
                {/* <p className="text-white text-lg text-center max-w-lg">{descriptions[activeFilter]}</p> */}

                <div className='w-full h-full overflow-y-scroll'>
                  {/* <div>
                    <ul className='flex flex-nowrap'>
                    {filteredSpots.map((spot) => {
                      return(
                          <li>{spot.spotName}</li>
                        
                      )
                    })}
                    </ul>
                  </div> */}
                 
                    {filteredSpots.map((spot) => {
                        return(
                          <div className='flex w-full h-64 bg-slate-50 rounded-md shadow-md mb-4'>
                            <div className='relative w-1/3 p-2'>
                              
                              {
                                spot.spotImageUrl ? (
                                
                                  <Image       
                                  src={`/${spot.spotImageUrl[0].substring(3)}`}
                                  fill
                                  alt={spot.spotName}
                                  className='p-2 object-cover rounded-md hover:scale-105' />
                                ) : ( 
                                  <Image       
                                  src="/DALL·E 2024-10-09 11.31.36_NoPic.png"
                                  fill
                                  alt={spot.spotName}
                                  className='p-2 object-cover rounded-md hover:scale-105' />
                                 )
                              }
                                
                            </div>
                            <div className='w-2/4 p-2'>
                              <h1 className='text-xl font-bold'>{spot.spotName}</h1>
                              <p className='text-sm'>{spot.spotDescription}</p>
                            </div>
                          </div>
                        )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  )
}

