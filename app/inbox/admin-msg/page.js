"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  FaUsers,
  FaEnvelope,
  FaSearch,
  FaUserPlus,
  FaPaperPlane,
  FaTimes,
} from "react-icons/fa";

export default function AdminNotificationPage() {
  const [query, setQuery] = useState("");
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch email suggestions for specific user selection
  useEffect(() => {
    const fetchEmailSuggestions = async () => {
      if (query.length > 1) {
        try {
          const response = await axios.get(
            `http://localhost:8000/users/search-email`,
            {
              params: { query: query },
            }
          );
          setEmailSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching email suggestions:", error);
        }
      } else {
        setEmailSuggestions([]);
      }
    };

    fetchEmailSuggestions();
  }, [query]);

  // Fetch all user emails if 'All Users' is selected
  useEffect(() => {
    const fetchAllEmails = async () => {
      if (recipients === "all") {
        try {
          setLoading(true);
          const response = await axios.get("http://localhost:8000/users");
          setSelectedUsers(response.data);
          setLoading(false);
        } catch (error) {
          toast.error("Error fetching all user emails");
          setLoading(false);
        }
      } else {
        setSelectedUsers([]);
      }
    };

    fetchAllEmails();
  }, [recipients]);

  // Handle adding selected users to the list
  const handleEmailSelect = (e) => {
    const selectedEmailValue = e.target.value;
    setSelectedEmail(selectedEmailValue);
    const user = emailSuggestions.find(
      (suggestion) => suggestion.email === selectedEmailValue
    );

    if (user && !selectedUsers.some((u) => u.email === user.email)) {
      setSelectedUsers((prev) => [...prev, user]);
    }

    setQuery("");
    setSelectedEmail("");
  };

  // Handle removing a selected user
  const handleRemoveUser = (email) => {
    setSelectedUsers((prev) => prev.filter((user) => user.email !== email));
  };

  // API call to send notification
  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (selectedUsers.length === 0 || !message) {
      toast.error("At least one user and a message are required.");
      return;
    }

    try {
      setLoading(true);
      for (const user of selectedUsers) {
        const requestData = {
          id: user.id,
          email: user.email,
          message,
        };

        await axios.post(
          "http://localhost:8000/notifications/admin-to-user",
          requestData
        );
      }
      
      setSelectedUsers([]);
      setMessage("");
      toast.success("Notification sent successfully");
      setLoading(false);
    } catch (error) {
      toast.error("Failed to send notification");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full">
          <div className="bg-gray-700 px-8 py-5">
            <div className="h-12 bg-gray-600 animate-pulse rounded w-3/4 mx-auto"></div>
          </div>
          <div className="p-8">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="mb-6 flex items-center">
                <div className="h-5 bg-gray-300 animate-pulse rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-10 max-w-[2300px]">
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
      
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full">
        <div className="bg-gray-700 px-8 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">User Notifications</h1>
          <div className="flex items-center space-x-6">
            <span className="text-white font-bold text-lg">
              Total Selected Users: {selectedUsers.length}
            </span>
          </div>
        </div>

        <form onSubmit={handleSendNotification} className="p-8 space-y-6">
          {/* Recipient Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaUsers className="mr-2" /> Select Recipients
            </label>
            <select
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- Select Recipient Type --
              </option>
              <option value="all">All Users</option>
              <option value="specific">Specific User by Email</option>
            </select>
          </div>

          {/* User Email Search */}
          {recipients === "specific" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FaSearch className="mr-2" /> Search and Select User Emails
              </label>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search user email"
                />
              </div>
              
              {emailSuggestions.length > 0 && (
                <select
                  value={selectedEmail}
                  onChange={handleEmailSelect}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    -- Select a user email --
                  </option>
                  {emailSuggestions.map((suggestion) => (
                    <option key={suggestion.email} value={suggestion.email}>
                      {suggestion.username
                        ? ` ${suggestion.username} (${suggestion.email})`
                        : suggestion.email}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Display Selected Users */}
          {selectedUsers.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Selected Users
              </label>
              <div className="space-y-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.email}
                    className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                  >
                    <span>
                      {user.username
                        ? `${user.username} (${user.email})`
                        : user.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveUser (user.email)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your message here"
              required
            />
          </div>

          {/* Send Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <FaPaperPlane className="mr-2" />
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
