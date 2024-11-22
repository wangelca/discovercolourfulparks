// components/AdminNotificationPage.js

"use client";

import { useState, useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function AdminNotificationPage() {
  const [query, setQuery] = useState("");
  const [recipients, setRecipients] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState(""); // Holds the user id for specific user selection
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // Holds selected user emails and IDs
  const [selectedEmail, setSelectedEmail] = useState(""); // Holds the currently selected email from dropdown
  const [eventId, setEventId] = useState("");
  const [spotId, setSpotId] = useState("");
  const [bookingDate, setBookingDate] = useState("");

  // Fetch email suggestions for specific user selection
  useEffect(() => {
    const fetchEmailSuggestions = async () => {
      if (query.length > 1) {
        // Fetch suggestions only for 2 or more characters
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
        const response = await axios.get("http://localhost:8000/users");

        // Assuming the response data is an array of user objects
        const users = response.data;

        // Set selectedUsers to include all fetched user objects
        setSelectedUsers(users); // users is an array of objects with fields like 'id' and 'email'
        
      } catch (error) {
        toast.error("Error fetching all user emails:", error);
      }
    } else {
      // Clear selected users when the recipient type is not 'all'
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
      setSelectedUsers((prev) => [...prev, user]); // Add user to selected users list
    }

    // Clear query after selection to allow searching for additional users
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

    for (const user of selectedUsers) {
      const requestData = {
        id: user.id,
        email: user.email,
        message,
      };

      console.log("Sending notification request data:", requestData);

      try {
        await axios.post(
          "http://localhost:8000/notifications/admin-to-user",
          requestData
        );
        setSelectedUsers([]); // Clear selected users after sending notification
        setMessage(""); // Clear message after sending notification
        toast.success("Notification sent successfully");
      } catch (error) {
        toast.error("Failed to send notification");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Send Message to Users
      </h1>

      <form
        onSubmit={handleSendNotification}
        className="bg-white p-6 rounded-lg shadow-lg space-y-6"
      >
        {/* Recipient Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Select Recipients
          </label>
          <select
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="" disabled>
              -- Select Recipient Type --
            </option>
            <option value="all">All Users</option>
            <option value="specific">Specific User by Email</option>
            <option value="booking">Users by Event/Spot Booking</option>
          </select>
        </div>

        {/* Conditional Input Fields */}
        {recipients === "specific" && (
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Search and Select User Emails
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Search user email"
            />
            {emailSuggestions.length > 0 && (
              <select
                value={selectedEmail}
                onChange={handleEmailSelect}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="" disabled>
                  -- Select a user email --
                </option>
                {emailSuggestions.map((suggestion) => (
                  <option key={suggestion.email} value={suggestion.email}>
                    {suggestion.username
                      ? `${suggestion.username} (${suggestion.email})`
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
            <label className="block text-gray-700 font-medium mb-2">
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
                    onClick={() => handleRemoveUser(user.email)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Write your message here"
            required
          />
        </div>

        {/* Send Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Send Notification
          </button>
        </div>
      </form>
    </div>
  );
}
