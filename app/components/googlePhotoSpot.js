import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function PlaceGallerySpot() {
    const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [photos, setPhotos] = useState([]); // Store photos for the carousel
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current photo index
    const { spotId } = useParams(); // Get dynamic route params
    const [spot, setSpot] = useState(null)
    
    useEffect(() => {
      if (spotId && !window.google) {
  
          axios.get(`/api/spots/${spotId}`)
            .then((response) => {
              setSpot(response.data);
            })
            .catch((error) => {
              console.error('Error fetching spot details:', error);
            });
     
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          setIsGoogleLoaded(true); // Set the flag once Google Maps is loaded
        };
        document.head.appendChild(script);
        
      } else {
        setIsGoogleLoaded(true); // If google is already available
      }
    }, [spotId]);
  
    useEffect(() => {
      if (!isGoogleLoaded || !spot) return; 
  
      async function init() {
          try {
            const { Place } = await google.maps.importLibrary('places');
            const place = new Place({
              id: spot.parameters
            });
    
            // Fetch the fields
            await place.fetchFields({ fields: ['displayName', 'photos', 'editorialSummary'] });
    
            let summary = document.getElementById('summary');  
  
            summary.textContent = place.editorialSummary || 'No Summary Available';
    
            // Check if photos are available
            if (place.photos && place.photos.length > 0) {
              setPhotos(place.photos); // Save photos to state for the carousel
            } else {
              setError('No photos available');
            }
          } catch (error) {
            setError('Failed to load Google Places data.');
          }
        }
    
        init();
      }, [isGoogleLoaded,spot]);
    
      // Handler for navigating to the next slide
      const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
      };
    
      // Handler for navigating to the previous slide
      const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
      };
    
      return (
        <div className="place-gallery">
          {error && <p className="error">{error}</p>}
          <p id="summary">Place Summary</p>
    
          {/* Tailwind Carousel */}
          <div id="custom-controls-gallery" className="relative w-full">
            {/* Carousel wrapper */}
            <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
              {photos.length > 0 ? (
                <div className="relative">
                  <img
                    src={photos[currentIndex].getURI({ maxHeight: 500 })}
                    className="block mx-auto w-100 h-full object-cover"
                    alt={`Place Photo ${currentIndex + 1}`}
                  />
                </div>
              ) : (
                <p>No photos available</p>
              )}
            </div>
    
            {/* Slider controls */}
            <div className="flex justify-center items-center pt-4">
              <button
                type="button"
                className="flex justify-center items-center me-4 h-full cursor-pointer group focus:outline-none"
                onClick={prevSlide} // Custom handler for previous slide
              >
                <span className="text-gray-400 hover:text-gray-900 dark:hover:text-white group-focus:text-gray-900 dark:group-focus:text-white">
                  <svg
                    className="rtl:rotate-180 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                    aria-hidden="true"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 5H1m0 0 4 4M1 5l4-4"
                    />
                  </svg>
                  <span className="sr-only">Previous</span>
                </span>
              </button>
              <button
                type="button"
                className="flex justify-center items-center h-full cursor-pointer group focus:outline-none"
                onClick={nextSlide} // Custom handler for next slide
              >
                <span className="text-gray-400 hover:text-gray-900 dark:hover:text-white group-focus:text-gray-900 dark:group-focus:text-white">
                  <svg
                    className="rtl:rotate-180 w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                    aria-hidden="true"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                  <span className="sr-only">Next</span>
                </span>
              </button>
            </div>
          </div> 
        </div>
      );
    }
  {/*Reference: 
    https://flowbite.com/docs/components/gallery/#gallery-with-slider
    https://developers.google.com/maps/documentation/places/web-service/place-photos*/}