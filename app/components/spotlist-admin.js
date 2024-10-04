import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SpotsAdmin() {
  const [spots, setSpots] = useState([]); // Initialize with an empty array
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8000/spots") // Update with your FastAPI endpoint
      .then((response) => response.json())
      .then((data) => setSpots(data))
      .catch((error) => console.error("Error fetching spots:", error));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Spots Database</h1>
        <button
          onClick={() => router.push("/manage-spots/add-spot")}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition"
        >
          Add Spot
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 font-semibold">
              <th className="py-3 px-6">Image</th>
              <th className="py-3 px-6">Spot Name</th>
              <th className="py-3 px-6">Hourly Rate</th>
              <th className="py-3 px-6">Description</th>
              <th className="py-3 px-6">Location</th>
              <th className="py-3 px-6">Details</th>
              <th className="py-3 px-6">Edit</th>
            </tr>
          </thead>
          <tbody>
            {spots.length > 0 ? (
              spots.map((spot) => (
                <tr
                  key={spot.spotId}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="py-3 px-6">
                    {spot.spotImageUrl && (
                      <img
                        src={spot.spotImageUrl}
                        alt={`Image of ${spot.spotName}`}
                        className="w-24 h-auto rounded-lg"
                      />
                    )}
                  </td>
                  <td className="py-3 px-6">{spot.spotName}</td>
                  <td className="py-3 px-6">{spot.spotHourlyRate}</td>
                  <td className="py-3 px-6">{spot.spotDescription}</td>
                  <td className="py-3 px-6">{spot.spotLocation}</td>
                  <td className="py-3 px-6">
                    <a
                      href={`/spots/${spot.spotId}`}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => router.push(`/edit-spot/${spot.spotId}`)}
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
                  No spots found.
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
  please help to improve the CSS using tailwind css and next.js, i want the data to be presented as a list, and like a user-friendly database. Besides, at the top, please add an "Add button", i will use fast api to add the spots details. Then, at the right hand side of each spot, please add an "Edit" button or words, i will use fast api to update the spot details
   */
}