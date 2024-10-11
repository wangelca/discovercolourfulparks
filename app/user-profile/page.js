'use client';

import ProfilePage from "../components/userprofile";
import UserBooking from "../components/user-booking";

export default function Home() {
  return (
    <div className="w-4/5 mx-auto justify-center flex flex-row space-x-2">            
            <div className="w-2/3 border-2 p-2 my-3 bg-white opacity-90"><ProfilePage/></div>
            <div className="w-1/3 border-2 p-2 my-3 bg-gray-200 opacity-80"><UserBooking/></div>
    </div>
  );
}