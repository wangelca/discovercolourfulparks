// components/InboxPage.js
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast, ToastContainer, Bounce } from "react-toastify"; //

export default function InboxPage() {
  const [notifications, setNotifications] = useState([]);
  const { isLoaded, isSignedIn, user } = useUser(); // Access loading and sign-in state
  const [profileData, setProfileData] = useState();
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

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
        const response = await axios.get(
          `http://localhost:8000/notifications/${profileData.id}`
        );
        // Sort notifications in descending order based on created_at
        setNotifications(
          response.data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );
      } catch (error) {
        toast.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [profileData]); // Re-run the effect when profileData changes

  const markAsRead = async (msgId) => {
    try {
      await axios.put(`http://localhost:8000/notifications/${msgId}`, {
        status: "read",
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.msgId === msgId
            ? { ...notification, status: "read" }
            : notification
        )
      );
    } catch (error) {
      toast.error("Error marking notification as read:", error);
    }
  };

  const handleCreateMessage = () => {
    if (!user) return;

    if (user.publicMetadata?.role === "admin") {
      window.location.href = "/inbox/admin-msg";
    } else if (user.publicMetadata?.role === "visitor") {
      window.location.href = "/inbox/visitor-msg";
    }
  };

  const handleReplyMessage = (notification) => {
    setCurrentNotification(notification);
    setReplyMessage(`Reply to message: ${notification.message}`);
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async () => {
    if (!user || !currentNotification) return;

    let recipientEmail = "";
    let recipientId = "";

    if (user.publicMetadata?.role === "admin") {
      // Extract the sender's email and ID from the original message if it's user-to-admin
      const emailMatch = currentNotification.message.match(/From: (\S+@\S+)/);
      const idMatch = currentNotification.message.match(/User Id: (\d+)/);
      recipientEmail = emailMatch ? emailMatch[1] : currentNotification.senderEmail;
      recipientId = idMatch ? idMatch[1] : "";
    } else if (user.publicMetadata?.role === "visitor") {
      // For visitors, reply is always sent to the admin email
      recipientEmail = "wuiyitang@gmail.com";
      recipientId = 92; 
    }


    const requestData = {
      id: recipientId,
      email: recipientEmail,
      message: replyMessage,
    };

    try {
      await axios.post(
        "http://localhost:8000/notifications/admin-to-user",
        requestData
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif.msgId === currentNotification.msgId
            ? { ...notif, status: "replied" }
            : notif
        )
      );
      setIsReplyModalOpen(false);
      setReplyMessage("");
      setCurrentNotification(null);
      toast.success("Reply sent successfully");
    } catch (error) {
      toast.error("Failed to send reply:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inbox</h1>
      <div className="flex justify-start my-3">
        <button
          className="px-6 py-3 bg-white bg-opacity-70 border-amber-500 border-3 text-grey-600 font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
          onClick={handleCreateMessage}
        >
          Create Message
        </button>
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg space-y-4 sm:space-y-6">
        {notifications.length === 0 ? (
          <p className="text-gray-600">You have no notifications.</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.msgId}
              className="p-4 border border-gray-300 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
            >
              <div className="text-green-500">
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
                    d="M13 16h-1v-4h-1m1 4v2m6-2V9a6 6 0 00-12 0v7a6 6 0 0012 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">
                  {notification.message}
                </p>
                <p className="text-gray-500 text-sm">
                  Status: {notification.status}
                </p>
                <p className="text-gray-500 text-sm">
                  Sent Time:{" "}
                  {formatDistanceToNow(parseISO(notification.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>

              <div className="space-x-0 sm:space-x-2 mt-4 sm:mt-0 flex flex-col sm:flex-row w-full sm:w-auto">
                <button
                  onClick={() => markAsRead(notification.msgId)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Mark as Read
                </button>
                <button
                  onClick={() => handleReplyMessage(notification)}
                  className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Reply
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isReplyModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-1/3">
            <h2 className="text-xl font-bold mb-4">Reply to Message</h2>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
