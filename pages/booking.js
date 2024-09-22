import { useState, useEffect } from 'react';

export default function Bookings() {
  const [bookings, setBookings] = useState([]); // Initialize with an empty array

  useEffect(() => {
    fetch('/api/booking')
      .then((response) => response.json())
      .then((data) => setBookings(data))
      .catch((error) => console.error('Error fetching bookings:', error));
  }, []);

  return (
    <div>
      <h1>Bookings</h1>
      <ul>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <li key={booking.bookingId}>
              Booking Date: {new Date(booking.bookingDate).toLocaleDateString()}, Amount: {booking.calculatedAmount}
            </li>
          ))
        ) : (
          <p>No bookings found.</p> // Show a message if no bookings exist
        )}
      </ul>
    </div>
  );
}
