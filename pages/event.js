import { useState, useEffect } from 'react';

export default function Events() {
  const [events, setEvents] = useState([]); // Initialize with an empty array

  useEffect(() => {
    fetch('/api/event')
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.length > 0 ? (
          events.map((event) => (
            <li key={event.eventId}>
              Event Name: {event.eventName}, Location: {event.eventLocation}, Date: {new Date(event.eventDate).toLocaleDateString()}
            </li>
          ))
        ) : (
          <p>No events found.</p> // Show a message if there are no events
        )}
      </ul>
    </div>
  );
}
