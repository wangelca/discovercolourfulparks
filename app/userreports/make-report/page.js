'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function MakeReportPage() {
  const [parks, setParks] = useState([]);
  const [filteredParks, setFilteredParks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedPark, setSelectedPark] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchParks = async () => {
      try {
        const response = await axios.get('http://localhost:8000/parks');
        setParks(response.data);
        setFilteredParks(response.data);
      } catch (error) {
        console.error('Error fetching parks:', error);
      }
    };
    fetchParks();
  }, []);

  const provinces = ['Alberta', 'British Columbia'];

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    filterParks(province, searchQuery);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterParks(selectedProvince, e.target.value);
  };

  const filterParks = (province, query) => {
    let filtered = parks;

    if (province) {
      filtered = filtered.filter((park) => park.province === province);
    }

    if (query) {
      filtered = filtered.filter((park) =>
        park.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredParks(filtered);
  };

  const handleParkSelect = (park) => {
    setSelectedPark(park);
  };

  const handleProceedToReport = () => {
    if (selectedPark) {
      router.push(`/userreports/make-report/${selectedPark.parkId}`);
    }
  };

  return (
    <div className="container mx-auto mt-10 p-8 bg-gradient-to-r from-blue-50 to-white rounded-lg shadow-lg max-w-3xl">
      <h1 className="text-5xl font-bold mb-8 text-center text-gray-800">Submit A Report</h1>

      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-700 mb-2">Filter by Province</h2>
        <div className="flex space-x-4">
          {provinces.map((province) => (
            <span
              key={province}
              onClick={() => handleProvinceChange(province)}
              className={`cursor-pointer px-4 py-2 rounded-lg text-gray-800 transition-colors duration-150 border-2 ${
                selectedProvince === province ? 'bg-blue-300 border-blue-500 font-bold' : 'border-transparent hover:bg-blue-200'
              }`}
            >
              {province}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 mb-2">Search for a Park</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Type to search..."
          className="input bg-white border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-md"
        />
      </div>

      <div>
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Available Parks</h2>
        {filteredParks.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredParks.map((park) => (
              <div
                key={park.parkId}
                className={`p-4 rounded-lg transition duration-150 shadow-lg hover:shadow-xl cursor-pointer border border-gray-200 ${
                  selectedPark?.parkId === park.parkId ? 'bg-blue-300' : 'hover:bg-blue-50'
                }`}
                onClick={() => handleParkSelect(park)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-800">{park.name}</span>
                  <span className="text-sm text-gray-600">{park.province}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No parks found. Try adjusting your filters.</p>
        )}
      </div>

      {selectedPark && (
        <div className="mt-8 text-center">
          <button
            onClick={handleProceedToReport}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-md"
          >
            Proceed to Report for {selectedPark.name}
          </button>
        </div>
      )}
    </div>
  );
}
