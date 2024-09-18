import { useEffect, useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from the API when the component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');  // Fetch from the API
        const data = await response.json();
        setUsers(data);  // Update state with the fetched users
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);  // Stop loading indicator
      }
    }

    fetchUsers();
  }, []);  // Empty dependency array ensures it only runs once on mount

  if (loading) {
    return <p>Loading users...</p>;  // Show loading message
  }

  if (users.length === 0) {
    return <p>No users found.</p>;  // Show a message if no users are found
  }

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username || 'Anonymous User'} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
