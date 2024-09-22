import { useState, useEffect } from 'react';

export default function Payments() {
  const [payments, setPayments] = useState([]); // Initialize with an empty array

  useEffect(() => {
    fetch('/api/payment')
      .then((response) => response.json())
      .then((data) => setPayments(data))
      .catch((error) => console.error('Error fetching payments:', error));
  }, []);

  return (
    <div>
      <h1>Payments</h1>
      <ul>
        {payments.length > 0 ? ( // Check if payments exist before mapping
          payments.map((payment) => (
            <li key={payment.paymentId}>
              Payment ID: {payment.paymentId}, Status: {payment.paymentStatus}
            </li>
          ))
        ) : (
          <p>No payments found.</p> // Display a message if no payments are available
        )}
      </ul>
    </div>
  );
}
