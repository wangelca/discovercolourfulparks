'use client';

import { useState, useEffect } from 'react';

export default function Parks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Alberta");
  const [filterOption, setFilterOption] = useState("alphabetical");
  const [parks, setParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch parks from FastAPI backend
  useEffect(() => {
    async function fetchParks() {
      try {
        const response = await fetch(`http://localhost:8000/parks/province/${selectedProvince}`);
        const data = await response.json();
        setParks(data); // Store fetched parks in state
        setLoading(false);
      } catch (error) {
        console.error('Error fetching parks:', error);
        setLoading(false);
      }
    }

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
    <div className="flex h-screen bg-gray-100">
      {/* Left side: Park list */}
      <div className="w-1/3 p-4 overflow-y-auto border-r border-gray-300 bg-white">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          National Parks in {selectedProvince}
        </h2>

        {/* Search and Filter */}
        <div className="flex items-center mb-6 gap-2">
          <input
            type="text"
            placeholder="Search parks..."
            className="p-2 border border-gray-300 rounded-md w-full text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-gray-900"
          >
            <option value="alphabetical">A - Z</option>
          </select>
        </div>

        {/* Province Selection */}
        <div className="flex gap-2 mb-6">
          {["Alberta", "British Columbia"].map((province) => (
            <button
              key={province}
              onClick={() => setSelectedProvince(province)}
              className={`p-2 border border-gray-300 rounded-md ${
                selectedProvince === province
                  ? "bg-blue-600 text-white font-bold"
                  : "text-gray-800 hover:bg-blue-200"
              }`}
            >
              {province}
            </button>
          ))}
        </div>

        {/* Park List */}
        <div className="flex flex-col gap-4">
          {filteredParks.map((park) => (
            <div
              key={park.parkId}
              onClick={() => setSelectedPark(park)}
              className="bg-gray-50 rounded-lg shadow-md p-4 cursor-pointer hover:bg-blue-50 transition"
            >
              <div className="flex items-start gap-4">
                {/* Park Image */}
                <div className="w-20 h-20 overflow-hidden flex-shrink-0">
                  {park.parkImageUrl && (
                    <img
                      src={park.parkImageUrl[0]}
                      alt={park.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  )}
                </div>
                {/* Park Details */}
                <div className="flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800">{park.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-2">
                    {park.description}
                  </p>
                  <a
                    href={`/parks/${park.parkId}`}
                    className="text-blue-600 hover:underline text-sm mt-auto"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Google Map display */}
      <div className="w-2/3 flex items-center justify-center p-6">
        {selectedPark ? (
          <iframe
            title={selectedPark.name}
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            className="rounded-lg shadow-lg"
            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(selectedPark.name)}&zoom=10`}
          ></iframe>
        ) : (
          <div className="flex items-center justify-center w-full h-full text-center text-gray-500">
            <p>Select a park from the list to view its location on the map.</p>
          </div>
        )}
      </div>
    </div>
  );
}
