'use client';

import ProfilePage from "../components/userprofile";
import UserBooking from "../components/user-booking";

export default function Home() {
  return (
    <div className="w-4/5 mx-auto justify-center flex flex-row h-screen space-x-2 ">            
            <div className="w-1/2 border-2 p-2 my-3 bg-white bg-opacity-50"><ProfilePage/></div>
            <div className="w-1/2 border-2 p-2 my-3 bg-gray-200 bg-opacity-50"><UserBooking/></div>
    </div>
  );
}