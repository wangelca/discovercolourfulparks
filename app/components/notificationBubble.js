// components/NotificationBubble.js
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

export default function NotificationBubble({ menuOpen }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const { isLoaded, isSignedIn, user } = useUser(); // Access loading and sign-in state
  const [profileData, setProfileData] = useState();

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return; // Ensure user is loaded and signed in
    fetch(`http://localhost:8000/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((error) =>
        console.error("Error fetching profile details:", error)
      );
  }, [user, isLoaded, isSignedIn]);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!profileData || !profileData.id) return;
      try {
        const response = await axios.get(
          `http://localhost:8000/notifications/unread-count/${profileData.id}`
        );
        setNotificationCount(response.data.unread_count);
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    // Fetch notification count whenever the menu is opened
    if (menuOpen) {
      fetchNotificationCount();
    }
  }, [profileData, menuOpen]);

  return (
    <div className="relative inline-block">
      {/* Bell Icon */}
      <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.003 6.003 0 00-5-5.917V4a1 1 0 10-2 0v1.083A6.003 6.003 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      </button>

      {/* Notification Counter Bubble */}
      {notificationCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
          {notificationCount}
        </span>
      )}
    </div>
  );
}
