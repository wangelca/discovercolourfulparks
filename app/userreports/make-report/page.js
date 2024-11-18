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

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    filterParks(e.target.value, searchQuery);
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
    <div className="container mx-auto mt-10 p-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg max-w-3xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-900">Create a Park Report</h1>

      <div className="mb-6">
        <label className="block text-lg font-medium text-blue-900 mb-2">Filter by Province</label>
        <select
          value={selectedProvince}
          onChange={handleProvinceChange}
          className="input bg-white border border-blue-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Provinces</option>
          <option value="Alberta">Alberta</option>
          <option value="British Columbia">British Columbia</option>
          {/* Add more provinces as needed */}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium text-blue-900 mb-2">Search for a Park</label>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Type to search..."
          className="input bg-white border border-blue-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4 text-blue-900">Available Parks</h2>
        {filteredParks.length > 0 ? (
          <ul className="divide-y divide-blue-200">
            {filteredParks.map((park) => (
              <li
                key={park.parkId}
                className={`p-4 rounded-lg transition duration-150 shadow hover:shadow-lg cursor-pointer ${
                  selectedPark?.parkId === park.parkId ? 'bg-blue-200' : 'hover:bg-blue-50'
                }`}
                onClick={() => handleParkSelect(park)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-blue-800">{park.name}</span>
                  <span className="text-sm text-gray-600">{park.province}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No parks found. Try adjusting your filters.</p>
        )}
        </div>
  
        {selectedPark && (
          <div className="mt-8 text-center">
            <button
              onClick={handleProceedToReport}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              Proceed to Report for {selectedPark.name}
            </button>
          </div>
        )}
      </div>
    );
  }
