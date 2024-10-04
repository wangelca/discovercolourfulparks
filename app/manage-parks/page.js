'use client';

import ParksAdmin from "../components/parklist-admin";


export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
            <ParksAdmin />
    </div>

  );
}