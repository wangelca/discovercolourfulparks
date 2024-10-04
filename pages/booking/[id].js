"use client"; // This is a client component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function BookingDetails() {
  const router = useRouter();
  const { id } = router.query; // Get booking ID from the URL
  const [booking, setBooking] = useState(null);
  const [participants, setParticipants] = useState(1); // Default to 1 participant
  const [totalFee, setTotalFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('credit-card'); // Default payment method
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false); // For booking confirmation loading state

  useEffect(() => {
    if (id) {
      fetch(`/api/bookings/${id}`)  // Fetch booking details by ID
        .then(response => {
          if (!response.ok) {
            throw new Error('Booking not found');
          }
          return response.json();
        })
        .then(data => {
          setBooking(data);
          setTotalFee(data.event.fee ? data.event.fee * participants : 0); // Set initial fee based on event fee
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching booking:', error);
          alert('Error fetching booking. Please try again.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleParticipantsChange = (e) => {
    const count = parseInt(e.target.value, 10);
    if (count < 1) {
      alert('Participants must be at least 1');
      return;
    }
    setParticipants(count);
    if (booking) {
      setTotalFee(booking.event.fee * count); // Calculate total fee based on participants
    }
  };

  const handleConfirmation = () => {
    setConfirming(true);
    fetch(`/api/confirm-booking/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        participants,
        totalFee,
        paymentMethod,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('Booking confirmed!');
          router.push('/confirmation'); // Redirect to confirmation page
        } else {
          alert('Error confirming booking.');
        }
      })
      .catch(error => {
        console.error('Error confirming booking:', error);
        alert('Error confirming booking.');
      })
      .finally(() => {
        setConfirming(false);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Booking Details</h1>
      <p>Event: {booking.event.eventName}</p>
      <p>Location: {booking.event.eventLocation}</p>
      <p>Event Fee: ${booking.event.fee} per participant</p>

      <div className="my-4">
        <label htmlFor="participants">Number of Participants:</label>
        <input
          type="number"
          id="participants"
          value={participants}
          onChange={handleParticipantsChange}
          min="1"
          className="border rounded-md p-2 ml-2"
        />
      </div>

      <p>Total Fee: ${totalFee}</p>

      <div className="my-4">
        <label htmlFor="paymentMethod">Select Payment Method:</label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="border rounded-md p-2 ml-2"
        >
          <option value="credit-card">Credit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bank-transfer">Bank Transfer</option>
        </select>
      </div>

      <button
        onClick={handleConfirmation}
        disabled={confirming}
        className={`bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${confirming ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {confirming ? 'Confirming...' : 'Confirm Booking'}
      </button>
    </div>
  );
}
