'use client';

import ProfilePage from "../components/userprofile";
import UserBooking from "../components/user-booking";

export default function Home() {
  return (
    <div className="w-full md:w-4/5 mx-auto justify-center flex flex-col md:flex-row h-auto md:h-screen space-y-4 md:space-y-0 md:space-x-4 p-4">
      <div className="w-full md:w-1/2 border-2 p-4 bg-white bg-opacity-50">
        <ProfilePage />
      </div>
      <div className="w-full md:w-1/2 border-2 p-4 bg-gray-200 bg-opacity-50">
        <UserBooking />
      </div>
    </div>
  );
}