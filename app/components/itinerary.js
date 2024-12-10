"use client";

import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Itinerary() {
  const [days, setDays] = useState(1);
  const [activities, setActivities] = useState([]);
  const [budget, setBudget] = useState(100);
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [startTime, setStartTime] = useState("08:00");
  const [experienceType, setExperienceType] = useState("relaxation");
  const [province, setProvince] = useState("Alberta");
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { user } = useUser();

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10));
    return format(date, "hh:mm a");
  };

  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (adults < 1) {
      setError("At least one adult is required.");
      setLoading(false);
      return;
    }

    if (!startDate) {
      setError("Please select a start date.");
      setLoading(false);
      return;
    }

    // Calculate endDate
    const startDateObj = new Date(startDate);
    const endDateObj = addDays(startDateObj, days);
    const endDate = format(endDateObj, "yyyy-MM-dd");

    const params = new URLSearchParams({
      days: days.toString(),
      preference: activities.join(","),
      budget: budget.toString(),
      adults: adults.toString(),
      kids: kids.toString(),
      start_time: startTime,
      experience_type: experienceType,
      province,
      start_date: startDate,
      end_date: endDate,
    });

    try {
      const response = await fetch(
        `http://localhost:8000/itinerary?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch itinerary");
      }

      const data = await response.json();
      if (data.itinerary) {
        setItinerary(data);
        calculateTotalAmount(data.itinerary);
      } else {
        throw new Error("Invalid itinerary data structure");
      }
    } catch (error) {
      setError(
        `An error occurred while generating the itinerary: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = (itineraryDays) => {
    if (!itineraryDays || !Array.isArray(itineraryDays)) {
      setTotalAmount(0);
      return;
    }

    const amount = itineraryDays.reduce((acc, day) => {
      const dayCost = parseFloat(day.day_cost || 0);
      return acc + (isNaN(dayCost) ? 0 : dayCost);
    }, 0);

    const totalPeople = adults + kids;
    setTotalAmount(amount * totalPeople);
  };

  const handleBooking = async () => {
    const paidActivities =
      itinerary?.itinerary.flatMap((day) => day.paid_activities) || [];

    if (paidActivities.length === 0) {
      toast.info("No activities require booking.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/itinerary-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itinerary: { paid_activities: paidActivities },
          id: user.id,
          booking_date: format(new Date(), "yyyy-MM-dd"),
          adults: adults,
          kids: kids,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Booking successful!");
      } else {
        toast.error(`Booking failed: ${data.detail}`);
      }
    } catch (error) {
      toast.error("An error occurred while booking the itinerary.");
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col items-center w-11/12 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Itinerary Planning
      </h1>
      <form
        onSubmit={handleGenerateItinerary}
        className="w-full max-w-2xl bg-gray-200 bg-opacity-60 p-6 rounded-lg shadow-lg"
      >
        {/* Days */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Days:</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full p-2 border rounded"
          >
            <option value="1">1 Day</option>
            <option value="2">2 Days</option>
            <option value="3">3 Days</option>
          </select>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Location:</label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Alberta">Alberta</option>
            <option value="British Columbia">British Columbia</option>
          </select>
        </div>

        {/* Preferred Activities */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Preferred Activities:
          </label>
          <select
            multiple
            onChange={(e) =>
              setActivities([...e.target.selectedOptions].map((o) => o.value))
            }
            className="w-full p-2 border rounded h-32"
          >
            <option value="hiking">Hiking</option>
            <option value="wildlife">Wildlife Viewing</option>
            <option value="water">Water Activities</option>
            <option value="historical">Historical Tours</option>
          </select>
        </div>

        {/* Budget */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Budget Per Person:
          </label>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full"
          />
          <p className="mt-2">Selected Budget: ${budget}</p>
        </div>

        {/* Number of Adults */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Number of Adults:
          </label>
          <input
            type="number"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            min="1"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Number of Kids */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Number of Kids:
          </label>
          <input
            type="number"
            value={kids}
            onChange={(e) => setKids(Number(e.target.value))}
            min="0"
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Preferred Start Time */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Preferred Start Time:
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Experience Type */}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">
            Experience Type:
          </label>
          <select
            value={experienceType}
            onChange={(e) => setExperienceType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="relaxation">Relaxation</option>
            <option value="adventure">Adventure</option>
            <option value="educational">Educational</option>
            <option value="scenic">Scenic</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>
      </form>

      {/* Loading and Error Messages */}
      {loading && (
        <p className="mt-6 text-xl text-gray-500 animate-pulse">
          Generating your itinerary...
        </p>
      )}
      {error && <p className="mt-6 text-red-500 font-semibold">{error}</p>}

      {/* Display Itinerary */}
{itinerary &&
itinerary.itinerary &&
Array.isArray(itinerary.itinerary) &&
itinerary.itinerary.length > 0 ? (
  <div className="mt-10 w-full max-w-2xl bg-gray-200 bg-opacity-60 p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-6 text-center">
      Your Travel Itinerary
    </h2>
    {itinerary.itinerary.map((day, index) => (
      <div key={index} className="mb-8">
        <div className="bg-gray-500 text-white p-3 rounded-t mb-4">
          <h3 className="text-xl text-center font-semibold">Day {day.day}</h3>
        </div>
        {/* Timeline Component */}
        <ul className="relative border-l border-gray-200">
          {day.schedule.map((activity, i) => (
            <li key={i} className="mb-10 ml-6">
                                          <span className="text-lg font-semibold text-gray-800">
                        {formatTime(activity.start_time)} -{" "}
                        {formatTime(activity.end_time)}
                      </span>
                    <span
                      className="absolute flex items-center justify-center w-8 h-8 bg-green-500 rounded-full -left-4 ring-2 ring-white ring-opacity-45"
                    >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <div className="flex flex-col space-y-2">
                <h4 className="text-lg font-semibold text-gray-900">
                  {activity.type}: {activity.activity_name}
                </h4>
                <p className="text-gray-600">
                  <strong>Location:</strong> {activity.location}
                </p>
                <p className="text-gray-600">
                  <strong>Park:</strong> {activity.park_name || "N/A"}
                </p>
                <p className="text-gray-600">
                  <strong>Cost:</strong> {activity.cost === "Free" ? "Free" : activity.cost}
                </p>
              </div>
              {activity.cost !== "Free" && (
                <a
                  href={`/${activity.type.toLowerCase()}s/${activity.id}/book?adults=${adults}&kids=${kids}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors"
                >
                  Book Now
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    ))}
    <h3 className="text-xl text-center font-bold mt-4">
      Total Amount for {adults + kids} persons: ${Number(totalAmount).toFixed(2)}
    </h3>
    <button
      onClick={handleBooking}
      className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors mt-4"
    >
      Book Entire Itinerary
    </button>
  </div>
) : (
  !loading &&
  !error && (
    <p className="mt-6 text-gray-500">No itinerary data available.</p>
  )
)}

      <ToastContainer transition={Bounce} />
    </div>
  );
}
