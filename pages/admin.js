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
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map((admin) => (
              <tr key={admin.adminId}>
                <td>{admin.name}</td>
                <td>{admin.email}</td>
                <td>{admin.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>No admins found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
