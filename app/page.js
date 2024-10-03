'use client';

import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-[url('/bowlake_landingpage.jpg')]">
      <div className="relative w-full max-w-screen-xl mx-auto mt-4 mb-4 ;">
        <div className="relative h-[40vh] rounded-lg overflow-hidden">
          {/*<Image
            src="/bowlake_landingpage.jpg"
            alt="Beautiful Lake View"
            className="object-cover w-full h-full rounded-lg"
            style={{ transform: 'scaleX(1.1)' }}
            width={1920}
            height={1080}
          />*/}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6 py-12 z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Explore the World's Most Beautiful Parks
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Explore the never-ending beauty of Canada's national parks. Discover some of the most beautiful landscapes that occupy the Earth.
            </p>
            <a href="/parks" className="bg-white text-black font-semibold py-3 px-6 rounded-full text-lg transition hover:bg-gray-200">
              Explore Now
            </a>
          </div>
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-black">
            Top Attractions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col relative">
              <img src="/morrainelake_landingpage.jpg" alt="Morraine Lake" className="w-full h-64 object-cover"/>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-4 text-black">Morraine Lake</h3>
                <p className="text-gray-600 mb-4">
                  Morraine Lake is a stunning turquoise lake, cradled by the Valley of the Ten Peaks, located in Banff National Park, Alberta, Canada.
                </p>
                <a href="/spots/116" className="text-blue-600 hover:text-blue-700 font-semibold">Learn More</a>
              </div>
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11h14M12 5v14" />
                </svg>
              </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col relative">
              <img src="/pow_landingpage.jpg" alt="Prince of Wales Hotel" className="w-full h-64 object-cover"/>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-4 text-black">Prince of Wales Hotel</h3>
                <p className="text-gray-600 mb-4">
                  The Prince of Wales Hotel, located in the heart of Waterton Lakes National Park in Alberta, Canada, stands on the bluff overlooking Upper Waterton Lake.
                </p>
                <a href="/spots/414" className="text-blue-600 hover:text-blue-700 font-semibold">Learn More</a>
              </div>
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11h14M12 5v14" />
                </svg>
              </button>
            </div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col relative">
              <img src="/fs_landingpage.jpg" alt="Fairmont Banff Springs" className="w-full h-64 object-cover"/>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold mb-4 text-black">Fairmont Banff Springs</h3>
                <p className="text-gray-600 mb-4">
                  The Fairmont Banff Springs, formerly and commonly known as the Banff Springs Hotel, is a historic hotel in western Canada, located in Banff, Alberta.
                </p>
                <a href="/" className="text-blue-600 hover:text-blue-700 font-semibold">Learn More</a>
              </div>
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 11h14M12 5v14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


































