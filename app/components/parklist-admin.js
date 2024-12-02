import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaImage, 
  FaMapMarkerAlt, 
  FaInfo, 
  FaEdit, 
  FaFilter, 
  FaPlus 
} from 'react-icons/fa';

export default function ParksAdmin() {
  const [parks, setParks] = useState([]);
  const [filteredParks, setFilteredParks] = useState([]);
  const [filter, setFilter] = useState("Alphabetical");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/parks")
      .then((response) => response.json())
      .then((data) => {
        setParks(data);
        setFilteredParks(data.sort((a, b) => a.name.localeCompare(b.name)));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching parks:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let updatedParks = [...parks];
    if (filter === "Alberta") {
      updatedParks = parks.filter((park) => park.province === "Alberta");
    } else if (filter === "British Columbia") {
      updatedParks = parks.filter((park) => park.province === "British Columbia");
    } else if (filter === "Alphabetical") {
      updatedParks.sort((a, b) => a.name.localeCompare(b.name));
    }
    setFilteredParks(updatedParks);
  }, [filter, parks]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gray-700 px-6 py-4">
            <div className="h-10 bg-gray-600 animate-pulse rounded w-3/4 mx-auto"></div>
          </div>
          <div className="p-6">
            {[1,2,3,4,5].map(row => (
              <div key={row} className="mb-4 flex items-center">
                <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!parks || parks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <svg 
            className="mx-auto h-24 w-24 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-600">No Parks Found</h2>
          <p className="mt-2 text-gray-500">There are currently no parks in the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gray-700 px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Parks Database</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold text-lg">Total Parks: {parks.length}</span>
            <button
              onClick={() => router.push("/manage-parks/add-park")}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add Park</span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-b">
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-600" />
            <label htmlFor="filter" className="font-medium text-gray-700">Filter by:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="Alphabetical">Alphabetical</option>
              <option value="Alberta">Alberta</option>
              <option value="British Columbia">British Columbia</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  {[
                    { label: 'Image', icon: FaImage },
                    { label: 'Park Name', icon: FaMapMarkerAlt },
                    { label: 'Province', icon: FaMapMarkerAlt },
                    { label: 'Description', icon: FaInfo },
                    { label: 'Location', icon: FaMapMarkerAlt },
                    { label: 'Parameters', icon: FaInfo },
                    { label: 'Details', icon: FaInfo },
                    { label: 'Edit', icon: FaEdit }
                  ].map(({ label, icon: Icon }, index) => (
                    <th 
                      key={index} 
                      className="p-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="text-gray-500" />
                        <span>{label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredParks.map((park) => (
                  <tr 
                    key={park.parkId} 
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-3 text-sm text-gray-700 w-32">
                      {park.parkImageUrl && (
                        <img
                          src={park.parkImageUrl}
                          alt={`Image of ${park.name}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray- 700">{park.name}</td>
                    <td className="p-3 text-sm text-gray-700">{park.province}</td>
                    <td className="p-3 text-sm text-gray-700">{park.description}</td>
                    <td className="p-3 text-sm text-gray-700">{park.location}</td>
                    <td className="p-3 text-sm text-gray-700">{park.parameters}</td>
                    <td className="p-3 text-sm text-gray-700">
                      <a
                        href={`/parks/${park.parkId}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </td>
                    <td className="p-3 text-sm text-gray-700">
                      <button
                        onClick={() => router.push(`/manage-parks/edit-park/${park.parkId}`)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

{
  /*ChatGPT Prompt
  please help to improve the CSS using tailwind css and next.js, i want the data to be presented as a list, and like a user-friendly database. Besides, at the top, please add an "Add button", i will use fast api to add the  details. Then, at the right hand side of each line item, please add an "Edit" button or words, i will use fast api to update the  details
   */
}
