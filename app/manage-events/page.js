"use client"; 

import { useState, useEffect } from 'react';

export default function ManageEvents() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('/api/bookings')  
      .then(response => response.json())
      .then(data => setBookings(data))
      .catch(error => console.error('Error fetching bookings:', error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Manage Event Bookings</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">Booking ID</th>
            <th className="border px-4 py-2">Event Name</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Booking Date</th>
            <th className="border px-4 py-2">Booking Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <tr key={booking.bookingId}>
                <td className="border px-4 py-2">{booking.bookingId}</td>
                <td className="border px-4 py-2">{booking.event.eventName}</td>
                <td className="border px-4 py-2">{booking.userId || 'Guest'}</td>
                <td className="border px-4 py-2">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                <td className="border px-4 py-2">{booking.bookingStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No bookings found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
