'use client';

import UserList from "../components/userlist";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
            <UserList/>
    </div>

  );
}