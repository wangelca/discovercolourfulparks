import { useEffect, useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from the API when the component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        const clerkSync = await fetch('/api/clerkSync'); // 
        const syncResult = await clerkSync.json();
        console.log('Sync result:', syncResult);
        
        if (!clerkSync.ok) {
          console.error('Error syncing Clerk users:', syncResult);
          return;
        }

        const response = await fetch('/api/users');  // Fetch from the API
        const data = await response.json();
        if (Array.isArray(data)) {
        setUsers(data);  // Update state with the fetched users
      } else {
        console.error('Expected array but received:', data);
        setUsers([]);  // Fallback to an empty array
      } }
      catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);  // Fallback to an empty array
      } finally {
        setLoading(false);  // Stop loading indicator
      }
    }

    fetchUsers();
  }, []);  // Empty dependency array ensures it only runs once on mount

  if (loading) {
    return <p>Loading users...</p>;  // Show loading message
  }

  if (!users || users.length === 0) {
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
