"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaMapMarkerAlt,
  FaTicketAlt,
  FaEdit,
  FaSearch,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function SpotsAdmin() {
  const [spots, setSpots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const spotsPerPage = 5;

  const router = useRouter();

  useEffect(() => {
    const fetchTotalSpotsCount = async () => {
      try {
        const response = await fetch("http://localhost:8000/spots/count");
        if (!response.ok) {
          throw new Error(
            "Failed to fetch total spots count: " + response.statusText
          );
        }
        const totalCount = await response.json();
        setTotalPages(Math.ceil(totalCount / spotsPerPage));
      } catch (error) {
        console.error("Error fetching total spots count:", error);
      }
    };

    fetchTotalSpotsCount();
  }, []);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/spots?page=${currentPage}&limit=${spotsPerPage}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch spots: ${response.statusText}`);
        }
        const data = await response.json();
        setSpots(data);
        setFilteredSpots(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching spots:", error);
        setLoading(false);
      }
    };

    fetchSpots();
  }, [currentPage]);

  useEffect(() => {
    const filtered = spots.filter(
      (spot) =>
        spot.spotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spot.spotLocation.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSpots(filtered);
  }, [searchTerm, spots]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full">
          <div className="bg-gray-700 px-8 py-5">
            <div className="h-12 bg-gray-600 animate-pulse rounded w-3/4 mx-auto"></div>
          </div>
          <div className="p-8">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="mb-6 flex items-center">
                <div className="h-5 bg-gray-300 animate-pulse rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!spots || spots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
        <div className="text-center w-full max-w-screen-lg">
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
          <h2 className="mt-6 text-3xl font-bold text-gray-600">
            No Spots Found
          </h2>
          <p className="mt-3 text-gray-500">
            There are currently no spots in the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-10 max-w-[2300px]">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full">
        <div className="bg-gray-700 px-8 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Spots Database</h1>
          <div className="flex items-center space-x-6">
            <span className="text-white font-bold text-lg">
              Total Spots: {spots.length}
            </span>
            <button
              onClick={() => router.push("/manage-spots/add-spot")}
              className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <FaPlus />
              <span>Add Spot</span>
            </button>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-b">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by spot name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>
        </div>

        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  {[
                    { label: "Image", icon: FaMapMarkerAlt },
                    { label: "Spot ID", icon: FaTicketAlt },
                    { label: "Spot Name", icon: FaMapMarkerAlt },
                    { label: "Park ID", icon: FaTicketAlt },
                    { label: "Hourly Rate", icon: FaTicketAlt },
                    { label: "Description", icon: FaMapMarkerAlt },
                    { label: "Location", icon: FaMapMarkerAlt },
                    { label: "Details", icon: FaEdit },
                    { label: "Edit", icon: FaEdit },
                  ].map(({ label, icon: Icon }, index) => (
                    <th
                      key={index}
                      className="p-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="text- gray-500" />
                        <span>{label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSpots.map((spot) => (
                  <tr
                    key={spot.spotId}
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                  >
                    <td className="py-4 px-6">
                      {spot.spotImageUrl && (
                        <img
                          src={spot.spotImageUrl}
                          alt={`Image of ${spot.spotName}`}
                          className="w-auto h-auto rounded-lg"
                        />
                      )}
                    </td>
                    <td className="py-4 px-4">{spot.spotId}</td>
                    <td className="py-4 px-4">{spot.spotName}</td>
                    <td className="py-4 px-4">{spot.parkId}</td>
                    <td className="py-4 px-4">{spot.spotAdmission}</td>
                    <td className="py-4 px-4">{spot.spotDescription}</td>
                    <td className="py-4 px-4">{spot.spotLocation}</td>
                    <td className="py-4 px-4">
                      <a
                        href={`/spots/${spot.spotId}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => router.push(`/edit-spot/${spot.spotId}`)}
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

        <div className="bg-gray-50 px-8 py-6 flex justify-center items-center space-x-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 rounded-full bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 rounded-full bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

{
  /*ChatGPT Prompt
  please help to improve the CSS using tailwind css and next.js, i want the data to be presented as a list, and like a user-friendly database. Besides, at the top, please add an "Add button", i will use fast api to add the spots details. Then, at the right hand side of each spot, please add an "Edit" button or words, i will use fast api to update the spot details
   */
}
