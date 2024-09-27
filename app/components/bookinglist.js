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
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Booking Date</th>
            <th>Calculated Amount</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td>{booking.calculatedAmount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
