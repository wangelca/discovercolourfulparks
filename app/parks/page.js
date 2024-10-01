"use client";
import Parks from "../components/parklist";

export default function Home() {
  // const { isSignedIn } = useUser(); // Check if the user is signed in

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
      <Parks/>      
    </div>
  );
}
