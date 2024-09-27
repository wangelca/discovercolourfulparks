'use client';

import { useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function FeesPage() {
  const { isSignedIn } = useUser();
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedPark, setSelectedPark] = useState('');

  const albertaParks = [
    'Banff National Park',
    'Elk Island National Park',
    'Jasper National Park',
    'Waterton Lakes National Park',
  ];

  const bcParks = [
    'Glacier National Park',
    'Gulf Islands National Park Reserve',
    'Gwaii Haanas National Park Reserve',
    'Kootenay National Park',
    'Mount Revelstoke National Park Reserve',
    'Pacific Rim National Park Reserve',
    'Yoho National Park',
  ];

  const fees = {
    'Banff National Park': {
      daily: {
        adult: '$11.00',
        senior: '$9.50',
        youth: 'Free',
        family: '$22.00',
        commercial: '$9.35',
      },
    },
    'Elk Island National Park': {
      daily: {
        adult: '$9.00',
        senior: '$7.75',
        youth: 'Free',
        family: '$17.50',
        commercial: '$7.65',
      },
      annualEarlyBird: {
        adult: '$35.00',
        senior: '$30.50',
        youth: 'Free',
        family: '$87.25',
      },
      annual: {
        adult: '$43.50',
        senior: '$38.25',
        youth: 'Free',
        family: '$87.25',
        replacement: '$16.50',
      },
    },
    'Jasper National Park': {
      daily: {
        adult: '$11.00',
        senior: '$9.50',
        youth: 'Free',
        family: '$22.00',
        commercial: '$9.35',
      },
    },
    'Waterton Lakes National Park': {
      daily: {
        adult: '$11.00',
        senior: '$9.50',
        youth: 'Free',
        family: '$22.00',
        commercial: '$9.35',
      },
      annual: {
        adult: '$54.50',
        senior: '$46.50',
        youth: 'Free',
        family: '$109.00',
      },
    },
    'Glacier National Park': {
      daily: {
        adult: '$11.00',
        senior: '$9.50',
        youth: 'Free',
        family: '$22.00',
        commercial: '$9.35',
      },
      annual: {
        adult: '$54.50',
        senior: '$46.50',
        youth: 'Free',
        family: '$109.00',
      },
    },
    'Gulf Islands National Park Reserve': {
      noFees: 'No entrance fee is required but fees apply for camping, backcountry use, mooring, and reservations.',
    },
    'Gwaii Haanas National Park Reserve': {
      noFees: 'No entrance fee is required but fees apply for excursions, camping, and film/photography.',
    },
    'Kootenay National Park': {
      daily: {
        adult: '$11.00',
        senior: '$9.50',
        youth: 'Free',
        family: '$22.00',
        commercial: '$9.35',
      },
    },
    'Mount Revelstoke National Park Reserve': {
      daily: {
        adult: '$11.00',
        senior: '$9.50',
        youth: 'Free',
        family: '$22.00',
        commercial: '$9.35',
      },
      annual: {
        adult: '$54.50',
        senior: '$46.50',
        youth: 'Free',
        family: '$109.00',
      },
    },
    'Pacific Rim National Park Reserve': {
      daily: {
        adult: '$11.00',
        senior: '$9.50',
        youth: 'Free',
        family: '$22.00',
        commercial: '$9.35',
      },
      annual: {
        adult: '$54.50',
        senior: '$46.50',
        youth: 'Free',
        family: '$109.00',
      },
    },
    'Yoho National Park': {
      daily: {
        adult: '$11.00',
        senior: '$9.50',
        youth: 'Free',
        family: '$22.00',
        commercial: '$9.35',
      },
    },
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      <div className="relative">
        <img
          src="/banff_fees.jpg"
          alt="Banff Fees"
          className="w-screen object-cover h-[40vh]"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
          <h2 className="text-2xl font-semibold mb-4">
            Get ready to visit Alberta and British Columbia's parks and have your admissions fees ready!
          </h2>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setSelectedProvince('Alberta');
                setSelectedPark('');
              }}
              className={`px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out ${
                selectedProvince === 'Alberta'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-black hover:bg-opacity-30 hover:text-white'
              }`}
            >
              Alberta
            </button>
            <button
              onClick={() => {
                setSelectedProvince('British Columbia');
                setSelectedPark('');
              }}
              className={`px-4 py-2 rounded-full font-semibold transition duration-300 ease-in-out ${
                selectedProvince === 'British Columbia'
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-black hover:bg-opacity-30 hover:text-white'
              }`}
            >
              British Columbia
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
        {selectedProvince === 'Alberta' && (
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

        {selectedProvince === 'British Columbia' && (
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
                  <p>Commercial Group, per person: {fees[selectedPark].daily.commercial}</p>
                </div>
              )}
              {fees[selectedPark].annual && (
                <div>
                  <h4 className="font-semibold">Annual:</h4>
                  <p>Adult: {fees[selectedPark].annual.adult}</p>
                  <p>Senior: {fees[selectedPark].annual.senior}</p>
                  <p>Youth: {fees[selectedPark].annual.youth}</p>
                  <p>Family/Group: {fees[selectedPark].annual.family}</p>
                  <p>Replacement/Duplicate Pass: {fees[selectedPark].annual.replacement}</p>
                </div>
              )}
              {fees[selectedPark].annualEarlyBird && (
                <div>
                  <h4 className="font-semibold">Annual Early Bird:</h4>
                  <p>Adult: {fees[selectedPark].annualEarlyBird.adult}</p>
                  <p>Senior: {fees[selectedPark].annualEarlyBird.senior}</p>
                  <p>Youth: {fees[selectedPark].annualEarlyBird.youth}</p>
                  <p>Family/Group: {fees[selectedPark].annualEarlyBird.family}</p>
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
      </div>
    </div>
  );
}

