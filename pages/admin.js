import { useState, useEffect } from 'react';

export default function Admins() {
  const [admins, setAdmins] = useState([]); // Initialize with an empty array

  useEffect(() => {
    fetch('/api/admin')
      .then((response) => response.json())
      .then((data) => setAdmins(data))
      .catch((error) => console.error('Error fetching admins:', error));
  }, []);

  return (
    <div>
      <h1>Admins</h1>
      <ul>
        {admins.length > 0 ? ( // Only map if there are admins
          admins.map((admin) => (
            <li key={admin.adminId}>
              Name: {admin.name}, Email: {admin.email}, Role: {admin.role}
            </li>
          ))
        ) : (
          <p>No admins found.</p> // Show a message if there are no admins
        )}
      </ul>
    </div>
  );
}
