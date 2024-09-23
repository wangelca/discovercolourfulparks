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

  // Fetch users from the API when the component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        //const clerkSync = await fetch("/api/clerkSync"); 
        //const syncResult = await clerkSync.json();

        //if (!clerkSync.ok) {
        //  console.error("Error syncing Clerk users:", syncResult);
        //  return;
        //}

        const response = await fetch("/api/users"); // Fetch from the API
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data); // Update state with the fetched users
        } else {
          console.error("Expected array but received:", data);
          setUsers([]); // Fallback to an empty array
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]); // Fallback to an empty array
      } finally {
        setLoading(false); // Stop loading indicator
      }
    }

    fetchUsers();
  }, []); // Empty dependency array ensures it only runs once on mount

    // Filter the users based on search inputs
    const filteredUsers = users.filter(user => 
    (user.id) &&
      (user.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
      (user.firstName || '').toLowerCase().includes(searchFirstName.toLowerCase()) &&
      (user.lastName || '').toLowerCase().includes(searchLastName.toLowerCase()) &&
      (user.phoneNumber || '').toLowerCase().includes(searchPhone.toLowerCase())
    ));

  if (loading) {
    return <p>Loading users...</p>; // Show loading message
  }

  if (!users || users.length === 0) {
    return <p>No users found.</p>; // Show a message if no users are found
  }

  return (
    <div className="container mx-auto py-8">
    <h1 className="text-3xl font-bold text-center mb-8">User List</h1>
    <table className="min-w-full bg-white border-collapse block md:table">
      <thead className="block md:table-header-group">
        <tr className="border border-gray-300 md:border-none block md:table-row absolute -top-full md:top-auto -left-full md:left-auto md:relative">
          <th className="bg-gray-100 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">User ID</th>
          <th className="bg-gray-100 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">Email</th>
          <th className="bg-gray-100 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">First Name</th>
          <th className="bg-gray-100 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">Last Name</th>
          <th className="bg-gray-100 p-2 text-gray-700 font-bold md:border md:border-gray-300 text-left block md:table-cell">Phone Number</th>
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
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}
