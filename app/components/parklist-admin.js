import React, { useState, useEffect } from "react";

export default function ParksAdmin() {
  const [parks, setParks] = useState([]); // Initialize with an empty array

  useEffect(() => {
    fetch("http://localhost:8000/parks") // Update with your FastAPI endpoint
      .then((response) => response.json())
      .then((data) => setParks(data))
      .catch((error) => console.error("Error fetching parks:", error));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Parks Database</h1>
        <button
          onClick={() => router.push("/add-park")}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition"
        >
          Add Park
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 font-semibold">
              <th className="py-3 px-6">Image</th>
              <th className="py-3 px-6">Park Name</th>
              <th className="py-3 px-6">Province</th>
              <th className="py-3 px-6">Description</th>
              <th className="py-3 px-6">Location</th>
              <th className="py-3 px-6">Parameters</th>
              <th className="py-3 px-6">Details</th>
              <th className="py-3 px-6">Edit</th>
            </tr>
          </thead>
          <tbody>
            {parks.length > 0 ? (
              parks.map((park) => (
                <tr
                  key={park.parkId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6 w-32">
                    {park.parkImageUrl && (
                      <img
                        src={park.parkImageUrl}
                        alt={`Image of ${park.name}`}
                        className="w-24 h-auto rounded-lg"
                      />
                    )}
                  </td>
                  <td className="py-3 px-6">{park.name}</td>
                  <td className="py-3 px-6">{park.province}</td>
                  <td className="py-3 px-6">{park.description}</td>
                  <td className="py-3 px-6">{park.location}</td>
                  <td className="py-3 px-6">{park.parameters}</td>
                  <td className="py-3 px-6">
                    <a
                      href={`/parks/${park.parkId}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => router.push(`/edit-park/${[park].parkId}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-3 text-gray-500">
                  No parks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

{
  /*ChatGPT Prompt
  please help to improve the CSS using tailwind css and next.js, i want the data to be presented as a list, and like a user-friendly database. Besides, at the top, please add an "Add button", i will use fast api to add the  details. Then, at the right hand side of each line item, please add an "Edit" button or words, i will use fast api to update the  details
   */
}
