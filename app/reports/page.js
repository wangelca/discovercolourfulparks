'use client';

import Header from "../components/header";
import ReportPage from "../components/report";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
            <Header/>
            <ReportPage/>
    </div>

  );
}