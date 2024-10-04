import { useState, useEffect } from 'react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll function to toggle visibility of the button
  const scrollFunction = () => {
    if (window.scrollY > 20) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Function to scroll back to the top
  const backToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener('scroll', scrollFunction);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('scroll', scrollFunction);
    };
  }, []);

  return (
    <>
      {/* Only show the button when isVisible is true */}
      {isVisible && (
        <button        
          onClick={backToTop}
          className="fixed bottom-5 right-5 p-3 font-bold rounded-3xl opacity-50 bg-green-600 text-white hover:bg-green-700 shadow-lg transition-all  z-50"
        >
          Top
        </button>
      )}
    </>
  );
}


{/*Reference:https://tw-elements.com/docs/standard/components/scroll-back-to-top-button/ */}