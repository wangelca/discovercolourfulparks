"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function FeesPage() {
  const { isSignedIn } = useUser();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedPark, setSelectedPark] = useState("");
  const [selectedPass, setSelectedPass] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const albertaParks = [
    "Banff National Park",
    "Elk Island National Park",
    "Jasper National Park",
    "Waterton Lakes National Park",
  ];

  const bcParks = [
    "Glacier National Park",
    "Gulf Islands National Park Reserve",
    "Gwaii Haanas National Park Reserve",
    "Kootenay National Park",
    "Mount Revelstoke National Park Reserve",
    "Pacific Rim National Park Reserve",
    "Yoho National Park",
  ];

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

  const discoveryPassInfo = (
    <div className="mt-8 p-6 bg-white shadow-md rounded-lg text-black flex flex-wrap gap-6">
      <div className="flex-1">
        <h4 className="font-semibold text-lg">Cost:</h4>
        <p>Adult - $75.25</p>
        <p>Senior - $64.50</p>
        <p>Family/Group - $151.25</p>
        <a
          href="https://www.commandesparcs-parksorders.ca/en/decouverte-discovery?_ga=2.124083406.553489718.1710794358-1329834248.1669915314"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block px-4 py-2 bg-blue-800 text-white rounded-full font-semibold hover:bg-blue-700 transition duration-300"
        >
          Buy Now
        </a>
      </div>

      <div className="flex-1">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setShowShipping(!showShipping);
              setShowTerms(false);
            }}
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out ${
              showShipping
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:bg-opacity-30 hover:text-white"
            }`}
          >
            Shipping and Delivery
          </button>
          <button
            onClick={() => {
              setShowTerms(!showTerms);
              setShowShipping(false);
            }}
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out ${
              showTerms
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:bg-opacity-30 hover:text-white"
            }`}
          >
            Terms of Use
          </button>
        </div>

        {showShipping && (
          <div className="mt-4">
            <h4 className="font-semibold">Shipping and Delivery:</h4>
            <p>
              Parks Canada will temporarily accept printed confirmation emails
              that show a valid entry pass or permit. The printed confirmation
              email can be used until one month from date of purchase.
            </p>
            <p>
              <strong>Canada -</strong>
            </p>
            <p>Standard shipping and handling: $4.00 (6-15 business days)</p>
            <p>Express shipping and handling: $15.75 (2-5 business days)</p>
            <p>
              <strong>United States -</strong>
            </p>
            <p>Standard shipping and handling: $4.50 (6-20 business days)</p>
            <p>
              Express shipping and handling calculated at checkout (2-6 business
              days)
            </p>
            <p>
              <strong>China and Taiwan -</strong>{" "}
            </p>
            <p>
              Express shipping and handling calculated at checkout (5-7 business
              days)
            </p>
            <p>
              <strong>Other International Destinations -</strong>{" "}
            </p>
            <p>Standard shipping and handling: $6.50 (10-20 business days)</p>
            <p>
              Express shipping and handling calculated at checkout (5-7 business
              days)
            </p>
            <p>Add 2-3 business days for remote locations.</p>
          </div>
        )}

        {showTerms && (
          <div className="mt-4">
            <h4 className="font-semibold">Terms of Use:</h4>
            <p>
              By purchasing a Parks Canada Discovery Pass, you are agreeing to
              the following Terms of use.
            </p>
            <p>
              <strong>Locations:</strong>
            </p>
            <p>
              {" "}
              A Discovery Pass provides the holder with unlimited admission to
              all participating national parks, national marine conservation
              areas and national historic sites.
            </p>
            <p>
              <strong>Validity Period:</strong>{" "}
            </p>
            <p>
              The Discovery Pass is valid for a full 12 months from the date of
              purchase, expiring on the last day of the month in which it was
              purchased.
            </p>
            <p>
              Example: A Discovery Pass bought on January 15, 2024 will be valid
              until January 31, 2025.
            </p>
            <p>
              If a pass is purchased online within the last seven days of the
              month, the activation date will be the first day of the next
              month. This allows time for delivery.
            </p>
            <p>
              <strong>Exclusions:</strong>{" "}
            </p>
            <p>
              The Discovery Pass includes all the privileges and services that
              normally come with a daily admission pass or permit. Services such
              as Canadian Rockies Hot Springs admission, backcountry overnight
              use, guided tours or parking that normally carry a separate fee
              are excluded.
            </p>
            <p>Camping fees are not included.</p>
            <p>Family/group passes are not valid for commercial groups.</p>
            <p>
              <strong>Display and Usage:</strong>
            </p>
            <p>
              {" "}
              The Discovery Pass must be signed by the pass holder and is void
              if re-sold or transferred. The pass holder must be present when
              using the pass. Present your Discovery Pass upon arrival at
              national historic sites.
            </p>
            <p>
              <strong>Driving:</strong>{" "}
            </p>
            <p>
              Hang your pass from the rear-view mirror with the date facing
              forward or place your pass on the driver side dashboard with the
              date facing up.
            </p>
            <p>
              <strong>Arriving on Foot, Motorcycle, Boat, or Transit:</strong>
            </p>
            <p> Present your pass in person upon arrival.</p>
            <p>
              <strong>Lost Passes and Refunds:</strong>{" "}
            </p>
            <p>
              Keep your Discovery Pass in a safe place and retain your receipt
              as proof of purchase. Parks Canada is not liable for any loss. The
              Discovery Pass is non-refundable.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      <div className="relative">
        <img
          src="/banff_fees.jpg"
          alt="Banff Fees"
          className="w-screen object-cover h-[30vh]"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
          <h2 className="text-2xl font-semibold mb-4">
            Get ready to visit Alberta and British Columbia's parks and have
            your admissions fees ready!
          </h2>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setSelectedProvince("Alberta");
                setSelectedPark("");
                setSelectedPass(false);
              }}
              className={`px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out ${
                selectedProvince === "Alberta"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-black hover:bg-opacity-30 hover:text-white"
              }`}
            >
              Alberta
            </button>
            <button
              onClick={() => {
                setSelectedProvince("British Columbia");
                setSelectedPark("");
                setSelectedPass(false);
              }}
              className={`px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out ${
                selectedProvince === "British Columbia"
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-black hover:bg-opacity-30 hover:text-white"
              }`}
            >
              British Columbia
            </button>
            <button
              onClick={() => {
                setSelectedPass(true);
                setSelectedPark("");
                setSelectedProvince("");
              }}
              className={`px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out ${
                selectedPass
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-black hover:bg-opacity-30 hover:text-white"
              }`}
            >
              Discovery Pass
            </button>
          </div>

          <div className="mt-6 text-white text-lg">
            <p>Adult - Person 18 to 64 years of age</p>
            <p>Senior - Person 65 years of age or over</p>
            <p>Youth - Person 6 to 17 years of age</p>
            <p>Family/Group - Up to 7 people arriving in a single vehicle</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-8">
        {selectedProvince === "Alberta" && (
          <div className="flex flex-wrap gap-4 justify-center">
            {albertaParks.map((park, index) => (
              <div
                key={index}
                onClick={() => setSelectedPark(park)}
                className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer"
              >
                {park}
              </div>
            ))}
          </div>
        )}

        {selectedProvince === "British Columbia" && (
          <div className="flex flex-wrap gap-4 justify-center">
            {bcParks.map((park, index) => (
              <div
                key={index}
                onClick={() => setSelectedPark(park)}
                className="px-6 py-3 bg-white text-black rounded-full hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer"
              >
                {park}
              </div>
            ))}
          </div>
        )}

        {selectedPark && (
          <div className="mt-8 p-6 bg-white shadow-md rounded-lg text-black">
            <div className="flex flex-wrap gap-12">
              {fees[selectedPark].daily && (
                <div>
                  <h4 className="font-semibold">Daily:</h4>
                  <p>Adult: {fees[selectedPark].daily.adult}</p>
                  <p>Senior: {fees[selectedPark].daily.senior}</p>
                  <p>Youth: {fees[selectedPark].daily.youth}</p>
                  <p>Family/Group: {fees[selectedPark].daily.family}</p>
                  <p>
                    Commercial Group, per person:{" "}
                    {fees[selectedPark].daily.commercial}
                  </p>
                </div>
              )}
              {fees[selectedPark].annual && (
                <div>
                  <h4 className="font-semibold">Annual:</h4>
                  <p>Adult: {fees[selectedPark].annual.adult}</p>
                  <p>Senior: {fees[selectedPark].annual.senior}</p>
                  <p>Youth: {fees[selectedPark].annual.youth}</p>
                  <p>Family/Group: {fees[selectedPark].annual.family}</p>
                  <p>
                    Replacement/Duplicate Pass:{" "}
                    {fees[selectedPark].annual.replacement}
                  </p>
                </div>
              )}
              {fees[selectedPark].annualEarlyBird && (
                <div>
                  <h4 className="font-semibold">
                    Annual Early Bird (December 1 - March 31):
                  </h4>
                  <p>Adult: {fees[selectedPark].annualEarlyBird.adult}</p>
                  <p>Senior: {fees[selectedPark].annualEarlyBird.senior}</p>
                  <p>Youth: {fees[selectedPark].annualEarlyBird.youth}</p>
                  <p>
                    Family/Group: {fees[selectedPark].annualEarlyBird.family}
                  </p>
                </div>
              )}
              {fees[selectedPark].noFees && (
                <div>
                  <p>{fees[selectedPark].noFees}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedPass && discoveryPassInfo}
      </div>
    </div>
  );
}

//References:
//Fee Information for Parks - https://parks.canada.ca/voyage-travel/tarifs-fees
//Image - https://themilepost.com/articles/five-things-to-do-in-banff-national-park/
//Discovery  Pass iInformation - https://www.commandesparcs-parksorders.ca/en/decouverte-discovery?_ga=2.124083406.553489718.1710794358-1329834248.1669915314
