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
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.paymentId}>
                <td>{payment.paymentId}</td>
                <td>{payment.paymentStatus}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>No payments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
