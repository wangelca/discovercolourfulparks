'use client';

import Header from "../components/header";
import UserList from "../components/userList";

export default function Home() {
  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100">
            <Header/>
            <UserList/>
    </div>

  );
}