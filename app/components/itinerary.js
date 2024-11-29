"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Itinerary() {
  const [days, setDays] = useState(1);
  const [activities, setActivities] = useState([]);
  const [budget, setBudget] = useState(100);
  const [travelingWith, setTravelingWith] = useState("solo");
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [startTime, setStartTime] = useState("08:00");
  const [experienceType, setExperienceType] = useState("relaxation");
  //const [mealPreferences, setMealPreferences] = useState("none");
  const [spotLocation, setSpotLocation] = useState("Alberta");
  const [province, setProvince] = useState("Alberta"); // Changed spotLocation to province
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const { user } = useUser();

  const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hour, 10), parseInt(minute, 10));
    return format(date, "hh:mm a");
  };

  const filterActivitiesByBudget = (itinerary, budget) => {
    return itinerary.map((day) => {
      let totalCost = 0;
      const paidActivities = [];
      const freeActivities = day.free_activities || [];

      for (const activity of day.paid_activities || []) {
        const activityCost = parseFloat(activity.cost.replace("$", "").trim());
        if (totalCost + activityCost <= budget) {
          paidActivities.push(activity);
          totalCost += activityCost;
        } else {
          break;
        }
      }

      return {
        ...day,
        paid_activities: paidActivities,
        free_activities: freeActivities,
        day_cost: totalCost,
      };
    });
  };

  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      days: days.toString(),
      preference: activities.join(","),
      budget: budget.toString(),
      adults: adults.toString(),
      kids: kids.toString(),
      start_time: startTime,
      experience_type: experienceType,
      province,
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

    setTotalAmount(amount);
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
          adults: 2,
          kids: 1,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `Booking successful! Your booking ID is ${data.bookingId}`
        );
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
        Generate Itinerary
      </h1>
      <form
        onSubmit={handleGenerateItinerary}
        className="w-full max-w-2xl bg-gray-200 bg-opacity-60 p-6 rounded-lg shadow-lg"
      >
        {/* Days */}
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
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
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
        <div className="mt-10 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Your Travel Itinerary
          </h2>
          {itinerary.itinerary.map((day, index) => (
            <div key={index} className="mb-8">
              <div className="bg-blue-500 text-white p-3 rounded-t">
                <h3 className="text-xl font-semibold">Day {day.day}</h3>
              </div>
              <table className="w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Time</th>
                    <th className="p-2 border">Activity</th>
                    <th className="p-2 border">Location</th>
                    <th className="p-2 border">Park</th>
                    <th className="p-2 border">Cost</th>
                    <th className="p-2 border">Book</th>
                  </tr>
                </thead>
                <tbody>
                  {day.schedule.map((activity, i) =>
                    activity.type !== "Park" ? (
                      <tr key={i} className="text-center">
                        <td className="p-2 border">
                          {formatTime(activity.start_time)} -{" "}
                          {formatTime(activity.end_time)}
                        </td>
                        <td className="p-2 border">
                          {activity.type}: {activity.activity_name}
                        </td>
                        <td className="p-2 border">{activity.location}</td>
                        <td className="p-2 border">{activity.park_name}</td>
                        <td className="p-2 border">
                          {activity.cost === "Free"
                            ? "Free"
                            : `$${activity.cost}`}
                        </td>
                        <td className="p-2 border">
                          {activity.cost !== "Free" &&
                            activity.cost !== "$$None" && (
                              <a
                                href={`/${activity.type.toLowerCase()}s/${
                                  activity.id
                                }/book?adults=${adults}&kids=${kids}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors"
                              >
                                Book Now
                              </a>
                            )}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>
          ))}
          <h3 className="text-xl font-bold mt-4">
            Total Amount: ${Number(totalAmount).toFixed(2)}
          </h3>
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
