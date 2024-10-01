"use client";
import Parks from "../components/parklist";
import PlaceGallery from "../components/googlePhoto";

export default function Home() {

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
            <PlaceGallery/> 
      <Parks/>     
    </div>
  );
}
