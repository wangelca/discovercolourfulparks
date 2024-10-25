//references: ChatGPT
import React, { useState, useEffect } from "react";
import Link from 'next/link'; 

export default function EventList() {

    const [events, setEvents] = useState([]); // Initialize with an empty array
  
    useEffect(() => {
      fetch("http://localhost:8000/events") 
        .then((response) => response.json())
        .then((data) => setEvents(data))
        .catch((error) => console.error("Error fetching events:", error));
    }, []);

    return (
        <div>
            <h1>Events</h1>
            <ul>
                {events.map(event => (
                    <li key={event.eventId}>
                        <h2>{event.eventName}</h2>
                        {/* Link to the detailed event page */}
                        <Link href={`/events/${event.eventId}`}>View Details and Reviews</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

