// components/UserNotificationPage.js
'use client';

import { useState, useEffect } from 'react';

export default function UserNotificationPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "You have a new message from the admin", time: "5 mins ago" },
    { id: 2, message: "Your booking is confirmed", time: "2 hours ago" }
  ]); // Replace with dynamic data

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Notifications</h1>
      
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1 4v2m6-2V9a6 6 0 00-12 0v7a6 6 0 0012 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 font-medium">New Notification</p>
              <p className="text-gray-500 text-sm">{notification.message}</p>
            </div>
            <span className="text-xs text-gray-400">{notification.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
