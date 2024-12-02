import { useEffect, useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaClock, 
  FaSearch 
} from 'react-icons/fa';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    publicMetadata: ''
  });

  useEffect(() => {
    fetch('http://localhost:8000/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  // Advanced filtering with more robust search
  const filteredUsers = users.filter(user => 
    Object.keys(searchParams).every(key => 
      !searchParams[key] || 
      String(user[key] || '')
        .toLowerCase()
        .includes(searchParams[key].toLowerCase())
    )
  );

  // Loading state with skeleton loader
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gray-700 px-6 py-4">
            <div className="h-10 bg-gray-600 animate-pulse rounded w-3/4 mx-auto"></div>
          </div>
          <div className="p-6">
            {[1,2,3,4,5].map(row => (
              <div key={row} className="mb-4 flex items-center">
                <div className="h-4 bg-gray-300 animate-pulse rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty state with illustration
  if (!users || users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <svg 
            className="mx-auto h-24 w-24 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" 
            />
          </svg>
          <h2 className="mt-4 text-2xl font-bold text-gray-600">No Users Found</h2>
          <p className="mt-2 text-gray-500">There are currently no users in the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Professional Header */}
        <div className="bg-gray-700 px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold text-lg">Total Users: {users.length}</span>
          </div>
        </div>

        {/* Advanced Search and Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  {[
                    { label: 'User ID', icon: FaUser },
                    { label: 'Email', icon: FaEnvelope },
                    { label: 'First Name', icon: FaUser },
                    { label: 'Last Name', icon: FaUser },
                    { label: 'Phone', icon: FaPhone },
                    { label: 'Created', icon: FaClock },
                    { label: 'Updated', icon: FaClock },
                    { label: 'Profile', icon: FaUser }
                  ].map(({ label, icon: Icon }, index) => (
                    <th 
                      key={index} 
                      className="p-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="text-gray-500" />
                        <span>{label}</span>
                      </div>
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  {[
                    { key: 'id', placeholder: 'Search ID' },
                    { key: 'email', placeholder: 'Search Email' },
                    { key: 'firstName', placeholder: 'Search First Name' },
                    { key: 'lastName', placeholder: 'Search Last Name' },
                    { key: 'phoneNumber', placeholder: 'Search Phone' },
                    null,
                    null,
                    { key: 'publicMetadata', placeholder: 'Search Profile' }
                  ].map((item, index) => (
                    <td key={index} className="p-2">
                      {item ? (
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder={item.placeholder}
                            value={searchParams[item.key]}
                            onChange={(e) => setSearchParams(prev => ({
                              ...prev,
                              [item.key]: e.target.value
                            }))}
                            className="w-full px-3 py-2 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                          />
                          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                      ) : null}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr 
                    key={user.id} 
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                  >
                    {[
                      user.id,
                      user.email,
                      user.firstName || 'N/A',
                      user.lastName || 'N/A',
                      user.phoneNumber || 'N/A',
                      user.createdAt || 'N/A',
                      user.updatedAt || 'N/A',
                      user.publicMetadata || 'N/A'
                    ].map((value, index) => (
                      <td 
                        key={index} 
                        className="p-3 text-sm text-gray-700"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div> </div>
  );
}