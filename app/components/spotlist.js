import React, { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

export default function Spots() {
  const [spots, setSpots] = useState([]); // Initialize with an empty array
  const [hourlyRateRange, setHourlyRateRange] = useState([0, 500]); // Initial range of hourly rate
  const [selectedParkIds, setSelectedParkIds] = useState([]); // Stores selected park IDs
  const [parks, setParks] = useState([]); // Store parks fetched from the API
  const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown
  const { isSignedIn } = useUser(); // Check if the user is signed in

  // Function to fetch filtered spots
  const fetchSpots = useCallback(() => {
    let url = "http://localhost:8000/spots";
    const params = new URLSearchParams();

    // Add hourly rate range to params
    if (hourlyRateRange) {
      params.append("min_hourly_rate", hourlyRateRange[0]);
      params.append("max_hourly_rate", hourlyRateRange[1]);
    }

    // Add selected park IDs to params
    if (selectedParkIds.length > 0) {
      selectedParkIds.forEach((id) => params.append("park_id", id));
    }

    fetch(`${url}?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => setSpots(data))
      .catch((error) => console.error("Error fetching spots:", error));
  }, [hourlyRateRange, selectedParkIds]);

  useEffect(() => {
    fetch("http://localhost:8000/parks") // Make sure this matches your FastAPI endpoint
      .then((response) => response.json())
      .then((data) => setParks(data))
      .catch((error) => console.error("Error fetching parks:", error));
  }, []);

  useEffect(() => {
    fetchSpots(); // Fetch spots when the component mounts or filters change
  }, [hourlyRateRange, selectedParkIds, fetchSpots]);

  const handleSliderChange = (e) => {
    const minValue = e.target.value.split(",")[0];
    const maxValue = e.target.value.split(",")[1];
    setHourlyRateRange([Number(minValue), Number(maxValue)]);
  };
  // Handle checkbox selection
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedParkIds((prevSelectedParks) => [...prevSelectedParks, value]); // Add park ID to selected list
    } else {
      setSelectedParkIds(
        (prevSelectedParks) => prevSelectedParks.filter((id) => id !== value) // Remove park ID if unchecked
      );
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center w-11/12">
      <h1 className="text-3xl font-bold mb-6">Spots</h1>
      {/* Filter Section */}
      <div className="flex mb-6 border-2 w-3/5 rounded-2xl bg-gray-100 shadow-2 p-3">
        {/* Admission Fee Slider */}
        <div className="w-1/2 px-5 border-amber-200 border-r-3 ">
          <label className="block text-sm font-medium text-gray-700">
            Admission Fee Range
          </label>
          <input
            type="range"
            min="0"
            max="500"
            step="1"
            value={hourlyRateRange[1]} // Bind the value to the max value of the range
            onChange={(e) =>
              setHourlyRateRange([hourlyRateRange[0], Number(e.target.value)])
            }
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm mt-1">
            {/* Display Min and Max */}
            <span>${hourlyRateRange[0]}</span>
            <span>${hourlyRateRange[1]}</span>
          </div>
        </div>

        {/* Park ID Checkboxes */}
        <div className="w-1/2 px-5 justify-center">
          <label className="block font-medium text-sm leading-6 mb-3 text-gray-700">
            Park ID
          </label>
          <button
            id="dropdownDefault"
            data-dropdown-toggle="dropdown"
            className="text-white w-4/5 bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Filter by Park ID
            <svg
              className="w-4 h-4 ml-2"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </button>

          {/* Dropdown menu */}
          <div
            id="dropdown"
            className={`${
              showDropdown ? "block" : "hidden"
            } z-10 w-full p-3 bg-white rounded-lg shadow dark:bg-gray-700 overflow-auto max-h-60`}
          >
            <h6 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select Parks
            </h6>
            <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200 w-full">
              {parks.map((park) => (
                <li
                  key={park.parkId}
                  className="flex rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <input
                    id={`park-${park.parkId}`}
                    type="checkbox"
                    value={park.parkId}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 "
                  />
                  <label
                    htmlFor={`park-${park.parkId}`}
                    className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    {park.name}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {spots.length > 0 ? (
          spots.map((spot) => (
            <div
              key={spot.spotId}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105"
            >
              <div className="relative h-48 overflow-hidden">
                {spot.spotImageUrl && (
                  <img
                    src={spot.spotImageUrl}
                    alt={`Image of ${spot.spotName}`}
                    className="w-full h-full object-cover p-2"
                  />
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{spot.spotName}</h2>
                {spot.spotAdmission > 0 ? (
                  <p className="text-gray-700">
                    <strong>Admission: $</strong> {spot.spotAdmission}
                  </p>
                ) : (
                  <div>
                    {" "}
                    <strong>Free</strong>
                  </div>
                )}
                <p className="text-gray-600 mt-2 line-clamp-2">
                  {spot.spotDescription}
                </p>
                <p className="text-gray-700 mt-2">
                  <strong>Location: </strong> {spot.spotLocation}
                </p>
                <a
                  href={`/spots/${spot.spotId}`}
                  className="mt-4 inline-block bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-blue-600"
                >
                  View Details
                </a>
                {/* Add a button to route to booking page if requiredbooking is true */}
                {spot.requiredbooking ? (
                  <button
                    onClick={() => {
                      if (!isSignedIn) {
                        alert("Please sign in to continue booking.");
                        window.open("/sign-in", "_blank"); // Open Clerk sign-in in a new tab
                      } else {
                        window.location.href = `/spots/${spot.spotId}/book`; // Direct to booking page
                      }
                    }}
                    className="mt-4 ml-3 inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition hover:bg-green-600"
                  >
                    Book Now
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-lg font-medium text-gray-500">
            No spots found.
          </div>
        )}
      </div>
    </div>
  );
}

{
  /*Reference
  https://flowbite.com/blocks/application/filter/
  */
}
