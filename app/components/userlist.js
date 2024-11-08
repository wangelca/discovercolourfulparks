import { useEffect, useState } from "react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

    // Search/filter fields
    const [searchID, setSearchID] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchLastName, setSearchLastName] = useState('');    
    const [searchPhone, setSearchPhone] = useState('');
    const [searchPublicMetadata, setSearchPublicMetadata] = useState('');
 
  useEffect(() => {
    fetch('http://localhost:8000/users')
      .then((response) => response.json())
      .then((data) => {setUsers(data); setLoading(false);})
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

    // Filter the users based on search inputs
    const filteredUsers = users.filter(user => 
    (user.id) &&
      (user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      (user.firstName || '').toLowerCase().includes(searchFirstName.toLowerCase()) &&
      (user.lastName || '').toLowerCase().includes(searchLastName.toLowerCase()) &&
      (user.phoneNumber || '').toLowerCase().includes(searchPhone.toLowerCase()) &&
      (user.publicMetadata || '').toLowerCase().includes(searchPublicMetadata.toLowerCase())
    ));

  if (loading) {
    return <p>Loading users...</p>; // Show loading message
  }

  if (!users || users.length === 0) {
    return <p>No users found.</p>; // Show a message if no users are found
  }

  return (
    <div className="container mx-auto p-6 mb-10">
    <h1 className="text-3xl font-bold text-center mb-8">User List</h1>
    <div className="overflow-x-auto">
    <table className="min-w-full bg-white opacity-85 border text-black text-sm font-medium border-gray-200 rounded-lg">
    <thead>
    <tr className="bg-gray-700 text-left text-white font-semibold">
          <th >User ID</th>
          <th >Email</th>
          <th >First Name</th>
          <th >Last Name</th>
          <th >Phone Number</th>
          <th >Created at</th>
          <th >Last update at</th>
          <th >Profile</th>
        </tr>
        {/* Search inputs for filtering */}
        <tr className="block md:table-row">
          <td className="p-2 md:border md:border-gray-300 block md:table-cell">
            <input 
              type="text"
              placeholder="Search ID"
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
              className="p-2 w-full border rounded"
            />
          </td>
          <td className="p-2 md:border md:border-gray-300 block md:table-cell">
            <input 
              type="text"
              placeholder="Search Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="p-2 w-full border rounded"
            />
          </td>
          <td className="p-2 md:border md:border-gray-300 block md:table-cell">
            <input 
              type="text"
              placeholder="Search First Name"
              value={searchFirstName}
              onChange={(e) => setSearchFirstName(e.target.value)}
              className="p-2 w-full border rounded"
            />
          </td>
          <td className="p-2 md:border md:border-gray-300 block md:table-cell">
            <input 
              type="text"
              placeholder="Search Last Name"
              value={searchLastName}
              onChange={(e) => setSearchLastName(e.target.value)}
              className="p-2 w-full border rounded"
            />
          </td>
          <td className="p-2 md:border md:border-gray-300 block md:table-cell">
            <input 
              type="text"
              placeholder="Search Phone Number"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              className="p-2 w-full border rounded"
            />
          </td>
          <td></td>
          <td></td>
          <td className="p-2 md:border md:border-gray-300 block md:table-cell">
            <input 
              type="text"
              placeholder="Search Public Metadata"
              value={searchPublicMetadata}
              onChange={(e) => setSearchPublicMetadata(e.target.value)}
              className="p-2 w-full border rounded"
            />
            </td>
        </tr>
      </thead>
      <tbody className="block md:table-row-group">
        {filteredUsers.map(user => (
          <tr key={user.id} className="bg-gray-100 border border-gray-300 md:border-none block md:table-row">
            <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
              {user.id}
            </td>
            <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
              {user.email}
            </td>
            <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
              {user.firstName || 'N/A'}
            </td>
            <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
              {user.lastName || 'N/A'}
            </td>
            <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
              {user.phoneNumber || 'N/A'}
            </td>
            <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
              {user.createdAt || 'N/A'}
            </td>
            <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
              {user.updatedAt || 'N/A'}
            </td>
            <td className="p-2 md:border md:border-gray-300 text-left block md:table-cell">
              {user.publicMetadata || 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  </div>
  );
}
