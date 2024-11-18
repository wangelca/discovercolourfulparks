"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./itinerary.module.css";

export default function Itinerary() {
  const [days, setDays] = useState(1);
  const [activities, setActivities] = useState([]);
  const [budget, setBudget] = useState(100);
  const [travelingWith, setTravelingWith] = useState("solo");
  const [startTime, setStartTime] = useState("08:00");
  const [experienceType, setExperienceType] = useState("relaxation");
  const [mealPreferences, setMealPreferences] = useState("none");
  const [spotLocation, setSpotLocation] = useState("Alberta");
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
      traveling_with: travelingWith,
      start_time: startTime,
      experience_type: experienceType,
      meal_preferences: mealPreferences,
      spotLocation,
    });

    try {
      const response = await fetch(`http://localhost:8000/itinerary?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

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
      setError(`An error occurred while generating the itinerary: ${error.message}`);
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
    const paidActivities = itinerary?.itinerary.flatMap((day) => day.paid_activities) || [];

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
        toast.success(`Booking successful! Your booking ID is ${data.bookingId}`);
      } else {
        toast.error(`Booking failed: ${data.detail}`);
      }
    } catch (error) {
      toast.error("An error occurred while booking the itinerary.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Generate Itinerary</h1>
      <form onSubmit={handleGenerateItinerary} className={styles.form}>
        <div className={styles.label}>
          <label>Days:</label>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className={styles.select}>
            <option value="1">1 Day</option>
            <option value="2">2 Days</option>
            <option value="3">3 Days</option>
          </select>
        </div>

        <div className={styles.label}>
          <label>Location:</label>
          <select value={spotLocation} onChange={(e) => setSpotLocation(e.target.value)} className={styles.select}>
            <option value="Alberta">Alberta</option>
            <option value="British Columbia">British Columbia</option>
          </select>
        </div>

        <div className={styles.label}>
          <label>Preferred Activities:</label>
          <select multiple onChange={(e) => setActivities([...e.target.selectedOptions].map(o => o.value))} className={styles.select}>
            <option value="hiking">Hiking</option>
            <option value="wildlife">Wildlife Viewing</option>
            <option value="water">Water Activities</option>
            <option value="historical">Historical Tours</option>
          </select>
        </div>

        <div className={styles.label}>
          <label>Budget:</label>
          <input type="range" min="50" max="2000" step="50" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className={styles.range} />
          <p>Selected Budget: ${budget}</p>
        </div>

        <div className={styles.label}>
          <label>Traveling With:</label>
          <select value={travelingWith} onChange={(e) => setTravelingWith(e.target.value)} className={styles.select}>
            <option value="solo">Solo</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="pets">Pets</option>
          </select>
        </div>

        <div className={styles.label}>
          <label>Preferred Start Time:</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={styles.input} />
        </div>

        <div className={styles.label}>
          <label>Experience Type:</label>
          <select value={experienceType} onChange={(e) => setExperienceType(e.target.value)} className={styles.select}>
            <option value="relaxation">Relaxation</option>
            <option value="adventure">Adventure</option>
            <option value="educational">Educational</option>
            <option value="scenic">Scenic</option>
          </select>
        </div>

        <div className={styles.label}>
          <label>Meal Preferences:</label>
          <select value={mealPreferences} onChange={(e) => setMealPreferences(e.target.value)} className={styles.select}>
            <option value="none">No Preference</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="halal">Halal</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          Generate Itinerary
        </button>
      </form>

      {loading && <p className={styles.loading}>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {itinerary && itinerary.itinerary && Array.isArray(itinerary.itinerary) && itinerary.itinerary.length > 0 ? (
        <div className={styles.itineraryContainer}>
          <h2 className={styles.title}>Travel Itinerary</h2>
          {itinerary.itinerary.map((day, index) => (
            <div key={index} className={styles.dayContainer}>
              <div className={styles.dayHeader}>Day {day.day}</div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Activity</th>
                    <th>Cost</th>
                    <th>Book</th>
                  </tr>
                </thead>
                <tbody>
                  {day.schedule.map((activity, i) => (
                    <tr key={i}>
                      <td className={styles.timeColumn}>
                        {activity.start_time} - {activity.end_time}
                      </td>
                      <td className={styles.activityColumn}>
                        {activity.type}: {activity.activity_name}
                      </td>
                      <td className={styles.costColumn}>
                        {activity.cost === "Free" ? "Free" : `$${activity.cost}`}
                      </td>
                      <td>
                        {activity.type !== "Park" &&
                          activity.cost !== "Free" &&
                          activity.cost !== "$$None" && (
                            <a
                              href={`/${activity.type.toLowerCase()}s/${activity.id}/book`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.bookButton}
                            >
                              Book Now
                            </a>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          <h3 className={styles.totalAmount}>
            Total Amount: ${Number(totalAmount).toFixed(2)}
          </h3>
        </div>
      ) : (
        !loading && !error && <p>No itinerary data available.</p>
      )}
      <ToastContainer transition={Bounce} />
    </div>
  );
}