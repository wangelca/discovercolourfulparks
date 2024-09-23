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
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Location</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr key={event.eventId}>
                <td>{event.eventName}</td>
                <td>{event.eventLocation}</td>
                <td>{new Date(event.eventDate).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No events found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
