'use client';

import Header from "../components/header";
import ProfilePage from "../components/userProfile";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
            <Header/>
            <ProfilePage/>
    </div>

  );
}