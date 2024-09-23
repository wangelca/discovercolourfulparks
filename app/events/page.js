'use client';

import Header from "../components/header";
import Events from "../components/eventlist";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
            <Header/>
            <Events/>
    </div>

  );
}