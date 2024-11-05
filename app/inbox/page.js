// components/InboxPage.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from "@clerk/nextjs";

export default function InboxPage() {
  const [notifications, setNotifications] = useState([]);
  const { isLoaded, isSignedIn, user } = useUser(); // Access loading and sign-in state
  const [profileData, setProfileData] = useState();

  // Fetch user profile data
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return; // Ensure user is loaded and signed in
    fetch(`http://localhost:8000/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((error) =>
        console.error("Error fetching profile details:", error)
      );
  }, [user, isLoaded, isSignedIn]);
  
  // Fetch notifications once profileData is available
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!profileData || !profileData.id) return; // Wait until profileData is available
      try {
        const response = await axios.get(`http://localhost:8000/notifications/${profileData.id}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [profileData]); // Re-run the effect when profileData changes

  const markAsRead = async (msgId) => {
    try {
      await axios.put(`http://localhost:8000/notifications/${msgId}`, {
        status: 'read',
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.msgId === msgId
            ? { ...notification, status: 'read' }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };


  const handleCreateMessage = () => {
    if (!user) return;

    if (user.publicMetadata?.role === 'admin') {
      window.location.href = '/inbox/admin-msg';
    } else if (user.publicMetadata?.role === 'visitor') {
      window.location.href = '/inbox/visitor-msg';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inbox</h1>
      <div className="flex justify-end mt-6">
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleCreateMessage}
        >
          Create Message
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
        {notifications.length === 0 ? (
          <p className="text-gray-600">You have no notifications.</p>
        ) : (
          notifications.map((notification) => (
            <div key={notification.msgId} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">{notification.message}</p>
                <p className="text-sm text-gray-500">Status: {notification.status}</p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => markAsRead(notification.msgId)}
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => markAsRead(notification.msgId)}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
