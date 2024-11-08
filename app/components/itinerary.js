"use client";

import { useState } from 'react';
import styles from './itinerary.module.css';

export default function Itinerary() {
  const [days, setDays] = useState(1);
  const [activities, setActivities] = useState([]);
  const [budget, setBudget] = useState(100);
  const [travelingWith, setTravelingWith] = useState("solo");
  const [startTime, setStartTime] = useState("08:00");
  const [accessibility, setAccessibility] = useState(false);
  const [experienceType, setExperienceType] = useState("relaxation");
  const [mealPreferences, setMealPreferences] = useState("none");
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/itinerary?days=${days}`);
      if (!response.ok) throw new Error("Failed to fetch itinerary");
      const data = await response.json();
      setItinerary(data);
    } catch (error) {
      console.error("Error generating itinerary:", error);
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1>Generate Itinerary</h1>
      <form onSubmit={handleGenerateItinerary} className={styles.form}>
        <label>
          Days:
          <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value="1">1 Day</option>
            <option value="2">2 Days</option>
            <option value="3">3 Days</option>
          </select>
        </label>

        <label>
          Preferred Activities:
          <select multiple onChange={(e) => setActivities([...e.target.selectedOptions].map(o => o.value))}>
            <option value="hiking">Hiking</option>
            <option value="wildlife">Wildlife Viewing</option>
            <option value="water">Water Activities</option>
            <option value="historical">Historical Tours</option>
          </select>
        </label>

        <label>
          Budget:
          <input type="range" min="50" max="500" step="50" value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
        </label>

        <label>
          Traveling With:
          <select value={travelingWith} onChange={(e) => setTravelingWith(e.target.value)}>
            <option value="solo">Solo</option>
            <option value="family">Family</option>
            <option value="friends">Friends</option>
            <option value="pets">Pets</option>
          </select>
        </label>

        <label>
          Preferred Start Time:
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </label>

        <label>
          Accessibility:
          <input type="checkbox" checked={accessibility} onChange={(e) => setAccessibility(e.target.checked)} />
          Accessible only
        </label>

        <label>
          Experience Type:
          <select value={experienceType} onChange={(e) => setExperienceType(e.target.value)}>
            <option value="relaxation">Relaxation</option>
            <option value="adventure">Adventure</option>
            <option value="educational">Educational</option>
            <option value="scenic">Scenic</option>
          </select>
        </label>

        <label>
          Meal Preferences:
          <select value={mealPreferences} onChange={(e) => setMealPreferences(e.target.value)}>
            <option value="none">No Preference</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="halal">Halal</option>
          </select>
        </label>

        <button type="submit">Generate Itinerary</button>
      </form>

      {loading && <p className={styles.loading}>Loading...</p>}
      
      {itinerary && (
        <div className={styles.itineraryContainer}>
          <h2>Total Cost: ${itinerary.total_cost?.toFixed(2) || "0.00"}</h2>
          {itinerary.itinerary.map((day, index) => (
            <div key={index}>
              <h3 className={styles.dayHeader}>Day {day.day}</h3>
              <ul className={styles.list}>
                {day.activities.map((activity, i) => (
                  <li key={i} className={styles.listItem}>
                    <strong>{activity.type}</strong>: {activity.name} 
                    - ${activity.cost} 
                    - {activity.province} 
                    - Estimated Time: {activity.duration} mins
                  </li>
                ))}
              </ul>
              <p className={styles.dayCost}>Day Cost: ${day.day_cost?.toFixed(2) || "0.00"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
