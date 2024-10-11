import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ParksAdmin() {
  const [parks, setParks] = useState([]); // Initialize with an empty array
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/parks") // Update with your FastAPI endpoint
      .then((response) => response.json())
      .then((data) => setParks(data))
      .catch((error) => console.error("Error fetching parks:", error));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-black font-bold">Parks Database</h1>
        <button
          onClick={() => router.push("/manage-parks/add-park")}
          className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-800 transition"
        >
          Add Park
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-sm border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-700 text-left text-white font-semibold">
              <th className="w-1/5 py-3 px-6">Image</th>
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
                  <td className="w-1/6 py-3 px-6 w-32">
                    {park.parkImageUrl && (
                      <img
                        src={park.parkImageUrl}
                        alt={`Image of ${park.name}`}
                        className="w-auto h-auto rounded-lg"
                      />
                    )}
                  </td>
                  <td className="py-3 px-6 text-black font-medium text-sm">{park.name}</td>
                  <td className="py-3 px-6 text-black font-medium text-sm">{park.province}</td>
                  <td className="py-3 px-6 text-black font-medium text-sm">{park.description}</td>
                  <td className="py-3 px-6 text-black font-medium text-sm">{park.location}</td>
                  <td className="py-3 px-6 text-black font-medium text-sm">{park.parameters}</td>
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
                      onClick={() => router.push(`/edit-park/${park.parkId}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button
                    >
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
