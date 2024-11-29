"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function FeesPage() {
  const [selectedProvince, setSelectedProvince] = useState("Alberta");
  const [selectedPark, setSelectedPark] = useState("");

  const provinces = {
    Alberta: [
      "Banff National Park",
      "Elk Island National Park",
      "Jasper National Park",
      "Waterton Lakes National Park",
    ],
    "British Columbia": [
      "Glacier National Park",
      "Gulf Islands National Park Reserve",
      "Gwaii Haanas National Park Reserve",
      "Kootenay National Park",
      "Mount Revelstoke National Park Reserve",
      "Pacific Rim National Park Reserve",
      "Yoho National Park",
    ],
  };

  const fees = {
    "Banff National Park": {
      daily: {
        adult: "$11.00",
        senior: "$9.50",
        youth: "Free",
        family: "$22.00",
        commercial: "$9.35",
      },
    },
    "Elk Island National Park": {
      daily: {
        adult: "$9.00",
        senior: "$7.75",
        youth: "Free",
        family: "$17.50",
        commercial: "$7.65",
      },
      annualEarlyBird: {
        adult: "$35.00",
        senior: "$30.50",
        youth: "Free",
        family: "$87.25",
      },
      annual: {
        adult: "$43.50",
        senior: "$38.25",
        youth: "Free",
        family: "$87.25",
        replacement: "$16.50",
      },
    },
    "Jasper National Park": {
      daily: {
        adult: "$11.00",
        senior: "$9.50",
        youth: "Free",
        family: "$22.00",
        commercial: "$9.35",
      },
    },
    "Waterton Lakes National Park": {
      daily: {
        adult: "$11.00",
        senior: "$9.50",
        youth: "Free",
        family: "$22.00",
        commercial: "$9.35",
      },
      annual: {
        adult: "$54.50",
        senior: "$46.50",
        youth: "Free",
        family: "$109.00",
      },
    },
    "Glacier National Park": {
      daily: {
        adult: "$11.00",
        senior: "$9.50",
        youth: "Free",
        family: "$22.00",
        commercial: "$9.35",
      },
      annual: {
        adult: "$54.50",
        senior: "$46.50",
        youth: "Free",
        family: "$109.00",
      },
    },
    "Gulf Islands National Park Reserve": {
      noFees:
        "No entrance fee is required but fees apply for camping, backcountry use, mooring, and reservations.",
    },
    "Gwaii Haanas National Park Reserve": {
      noFees:
        "No entrance fee is required but fees apply for excursions, camping, and film/photography.",
    },
    "Kootenay National Park": {
      daily: {
        adult: "$11.00",
        senior: "$9.50",
        youth: "Free",
        family: "$22.00",
        commercial: "$9.35",
      },
    },
    "Mount Revelstoke National Park Reserve": {
      daily: {
        adult: "$11.00",
        senior: "$9.50",
        youth: "Free",
        family: "$22.00",
        commercial: "$9.35",
      },
      annual: {
        adult: "$54.50",
        senior: "$46.50",
        youth: "Free",
        family: "$109.00",
      },
    },
    "Pacific Rim National Park Reserve": {
      daily: {
        adult: "$11.00",
        senior: "$9.50",
        youth: "Free",
        family: "$22.00",
        commercial: "$9.35",
      },
      annual: {
        adult: "$54.50",
        senior: "$46.50",
        youth: "Free",
        family: "$109.00",
      },
    },
    "Yoho National Park": {
      daily: {
        adult: "$11.00",
        senior: "$9.50",
        youth: "Free",
        family: "$22.00",
        commercial: "$9.35",
      },
    },
  };

  return (
    <div className="relative flex flex-col min-h-screen">

      {/* Province Selection */}
      <div className="flex justify-center gap-2 my-4">
        {Object.keys(provinces).map((province) => (
          <button
            key={province}
            onClick={() => {
              setSelectedProvince(province);
              setSelectedPark("");
            }}
            className={`p-2 border border-gray-300 rounded-md w-full md:w-auto text-center transition-all duration-300 ease-in-out ${selectedProvince === province ? "bg-gray-200 text-gray-800 font-bold" : "text-gray-800 hover:bg-gray-200"}
            }`}
          >
            {province}
          </button>
        ))}
      </div>

      {/* Park Selection */}
      <div className="flex flex-wrap justify-center gap-4 my-4">
        {provinces[selectedProvince]?.map((park) => (
          <button
            key={park}
            onClick={() => setSelectedPark(park)}
            className={`px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-300 shadow-md transition duration-300 ${
              selectedPark === park ? "ring-2 ring-blue-500" : ""
            }`}
          >
            {park}
          </button>
        ))}
      </div>

      {/* Fee Details */}
      <div className="flex-grow flex justify-center items-center">
        {selectedPark ? (
          <div className="p-6 bg-white shadow-lg rounded-lg w-11/12 max-w-2xl">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Fees for {selectedPark}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fees[selectedPark]?.daily && (
                <div>
                  <h3 className="font-bold">Daily Fees:</h3>
                  <p>Adult: {fees[selectedPark].daily.adult}</p>
                  <p>Senior: {fees[selectedPark].daily.senior}</p>
                  <p>Youth: {fees[selectedPark].daily.youth}</p>
                  <p>Family: {fees[selectedPark].daily.family}</p>
                  <p>Commercial: {fees[selectedPark].daily.commercial}</p>
                </div>
              )}
              {fees[selectedPark]?.annual && (
                <div>
                  <h3 className="font-bold">Annual Fees:</h3>
                  <p>Adult: {fees[selectedPark].annual.adult}</p>
                  <p>Senior: {fees[selectedPark].annual.senior}</p>
                  <p>Youth: {fees[selectedPark].annual.youth}</p>
                  <p>Family: {fees[selectedPark].annual.family}</p>
                  <p>
                    Replacement Pass:{" "}
                    {fees[selectedPark].annual.replacement || "N/A"}
                  </p>
                </div>
              )}
              {fees[selectedPark]?.annualEarlyBird && (
                <div>
                  <h3 className="font-bold">Early Bird Annual Fees:</h3>
                  <p>Adult: {fees[selectedPark].annualEarlyBird.adult}</p>
                  <p>Senior: {fees[selectedPark].annualEarlyBird.senior}</p>
                  <p>Youth: {fees[selectedPark].annualEarlyBird.youth}</p>
                  <p>Family: {fees[selectedPark].annualEarlyBird.family}</p>
                </div>
              )}
              {fees[selectedPark]?.noFees && (
                <div>
                  <p>{fees[selectedPark].noFees}</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a park to view its fees.</p>
        )}
      </div>
    </div>
  );
}
