import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';

export default function UserProfile() {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      const response = await fetch(`/pages/api/${user.id}`);
      const data = await response.json();
      setUserData(data);
    }
    if (user) {
      fetchUserData();
    }
  }, [user]);

  if (!userData) return <div>Loading...</div>;

  return (
    <div>
      <h1>{userData.username}</h1>
      <p>{userData.email}</p>
      <p>Account created on: {new Date(userData.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
