'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const images = [
    '/bg/bowlake_landingpage.jpg',
    '/bg/2023BarrierLakeLookout23Sept100.jpg',
    '/bg/2023KingCreekRidge21.jpg',
    '/bg/2023CoalMineTrail9Oct-23.jpg',
    '/bg/2023ElbowLake16Jul-22.jpg',
    '/bg/2023ElbowLake16Jul-55.jpg',
    '/bg/2023KingCreekRidge57.jpg',
    '/bg/2024Banff29Mar-126.jpg',
    '/bg/2024Banff29Mar-161.jpg',
    '/bg/2024Banff29Mar-197.jpg',
    '/bg/2024Banff29Mar-229.jpg',
    '/bg/2024Banff29Mar-258.jpg',
    '/bg/2024ElbowRiver19Feb2.jpg',    
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Slide change interval

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };


  return (
    <div>
    <section>
    <div id="default-carousel" className="relative w-full h-screen" data-carousel="slide">
      {/* Carousel Wrapper */}
      <div className="relative h-screen overflow-hidden ">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              className="block w-full h-screen object-cover"
              alt={`Slide ${index + 1}`}
            />
            <div className="absolute inset-0 bg-black opacity-30"></div>
          </div>
        ))}

        {/* Text and Button */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 text-white px-6 py-12">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl lg:text-6xl">
            Explore the World’s Most Beautiful Parks
          </h1>
          <p className="mb-8 text-lg font-bold lg:text-xl sm:px-16 lg:px-48">
            Explore the never-ending beauty of Canada’s national parks. Discover
            some of the most beautiful landscapes that occupy the Earth.
          </p>
          <a
            href="/parks"
            className="bg-white text-black font-semibold py-3 px-6 rounded-full text-lg transition hover:bg-gray-200"
          >
            Explore Now
          </a>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              currentIndex === index ? 'bg-white' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Previous and Next Buttons */}
      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 focus:ring-4 focus:ring-white">
          <svg
            className="w-4 h-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 focus:ring-4 focus:ring-white">
          <svg
            className="w-4 h-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 9l4-4-4-4"
            />
          </svg>
        </span>
      </button>
    </div>
    </section>

      <section className="py-12">
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


































