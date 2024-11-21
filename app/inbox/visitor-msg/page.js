// components/VisitorSendNotificationPage.js

"use client";

import { useState, useEffect} from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VisitorSendNotificationPage() {
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("General Enquiry");
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

  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (!isLoaded || !isSignedIn || !user) {
      toast.error("You must login before sending a message to admin.");
      return;
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;
    const userId = profileData.id;

    if (!userEmail) {
      toast.error("User email is not available.");
      return;
    }

    if (!message) {
      toast.error("Message cannot be empty.");
      return;
    }

    const completeMessage = `Message category: ${category}\nFrom: ${userEmail}\nUser Id: ${userId}\nMessage: ${message}`;

    const requestData = {
      email: "wuiyitang@gmail.com",
      message: completeMessage,
    };

    try {
      const response = await axios.post("http://localhost:8000/notifications/user-to-admin", requestData);
      console.log("Response from backend:", response);
      toast.success("Notification sent successfully");
      setMessage("");
      setCategory("General Enquiry");
    } catch (error) {
      console.error("Failed to send notification:", error);
      toast.error("Failed to send notification");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
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
        Send Message to DCP Admin
      </h1>

      <form
        onSubmit={handleSendNotification}
        className="bg-white p-6 rounded-lg shadow-lg space-y-6"
      >
        {/* Recipient Information */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Recipient
          </label>
          <input
            type="text"
            value="DCP Admin"
            disabled
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="General Enquiry">General Enquiry</option>
            <option value="Booking Enquiry">Booking Enquiry</option>
            <option value="Payment Enquiry">Payment Enquiry</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Others">Others</option>
          </select>
        </div>

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
