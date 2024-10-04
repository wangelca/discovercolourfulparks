'use client';

import { useState, useEffect } from 'react';
import { set } from 'react-hook-form';

export default function Parks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Alberta");
  const [filterOption, setFilterOption] = useState("alphabetical");
  const [parks, setParks] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParks() {
      try {
        const response = await fetch(`/api/park?province=${selectedProvince}`);
        const data = await response.json();
        setParks(data); // Store fetched parks in state
        setLoading(false);
      } catch(error)
      { console.error('Error fetching parks:', error);
        setLoading(false);
      }}

      fetchParks();
    }, [selectedProvince]);
    const filteredParks = parks.filter((park) =>
      park.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    if (loading) {
      return <p>Loading parks...</p>;
    }
  
    return (
      <div className="relative flex flex-col min-h-screen bg-gray-100">
        <main className="container mx-auto px-6 py-12 flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Find a Park
          </h1>
  
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
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Provinces and Territories
            </h2>
            <div className="flex flex-wrap gap-2">
              {["Alberta", "British Columbia"].map(
                (province) => (
                  <button
                    key={province}
                    onClick={() => setSelectedProvince(province)}
                    className={`p-2 border border-gray-300 rounded-md ${
                      selectedProvince === province
                        ? "bg-gray-200 text-gray-800"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {province}
                  </button>
                )
              )}
            </div>
          </div>
  
          <div className="grid grid-cols-1 gap-6">
            {filteredParks.map((park) => (
              <div
                key={park.parkId}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex"
              >
                <img
                  src={park.parkImageUrl[0]}
                  alt={park.name}
                  className="w-1/3 h-auto object-cover"
                />
                <div className="p-4 w-2/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {park.name}
                  </h3>
                  <p className="text-gray-700 mb-4">{park.description}</p>
                  <a
                    href={`/parks/${park.parkId}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Park
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }
'use client';

import { useState, useEffect } from 'react';
import { set } from 'react-hook-form';

export default function Parks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Alberta");
  const [filterOption, setFilterOption] = useState("alphabetical");
  const [parks, setParks] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParks() {
      try {
        const response = await fetch(`/api/park?province=${selectedProvince}`);
        const data = await response.json();
        setParks(data); // Store fetched parks in state
        setLoading(false);
      } catch(error)
      { console.error('Error fetching parks:', error);
        setLoading(false);
      }}

      fetchParks();
    }, [selectedProvince]);
    const filteredParks = Array.isArray(parks)
  ? parks.filter((park) =>
      park.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];
  
    if (loading) {
      return <p>Loading parks...</p>;
    }
  
    return (
      <div className="relative flex flex-col min-h-screen bg-gray-100">
        <main className="container mx-auto px-6 py-12 flex flex-col">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Find a Park
          </h1>
  
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
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Provinces and Territories
            </h2>
            <div className="flex flex-wrap gap-2">
              {["Alberta", "British Columbia"].map(
                (province) => (
                  <button
                    key={province}
                    onClick={() => setSelectedProvince(province)}
                    className={`p-2 border border-gray-300 rounded-md ${
                      selectedProvince === province
                        ? "bg-gray-200 text-gray-800"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {province}
                  </button>
                )
              )}
            </div>
          </div>
  
          <div className="grid grid-cols-1 gap-6">
            {filteredParks.map((park) => (
              <div
                key={park.parkId}
                className="bg-white shadow-lg rounded-lg overflow-hidden flex"
              >
                <img
                  src={park.parkImageUrl[0]}
                  alt={park.name}
                  className="w-1/3 h-auto object-cover"
                />
                <div className="p-4 w-2/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {park.name}
                  </h3>
                  <p className="text-gray-700 mb-4">{park.description}</p>
                  <a
                    href={`/parks/${park.parkId}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Park
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }