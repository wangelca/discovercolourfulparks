import { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]); // Initialize with an empty array

  useEffect(() => {
    fetch('/api/user')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.length > 0 ? ( // Check if users exist before mapping
          users.map((user) => (
            <li key={user.id}>
              User Name: {user.name}, Email: {user.email}
            </li>
          ))
        ) : (
          <p>No users found.</p> // Show a message if no users are found
        )}
      </ul>
    </div>
  );
}
