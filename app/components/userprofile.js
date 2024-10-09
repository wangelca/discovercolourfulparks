'use client';

import { useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import axios from 'axios';

export default function ProfilePage() {
  const { user } = useUser(); // Get current user details from Clerk
  const { clerk } = useClerk();

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    emailAddress: user?.primaryEmailAddress?.emailAddress || '', // Display email
  });

  const [isEditing, setIsEditing] = useState(false); // Controls form edit state
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch the user profile details from your database using Clerk's user.id
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/users/${user.id}`); // Assuming user.id matches with clerk_user_id in DB
        const { firstName, lastName, phoneNumber } = response.data;
        setProfileData({
          firstName,
          lastName,
          phoneNumber,
          emailAddress: user?.primaryEmailAddress?.emailAddress,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile data.");
      }
    };

    fetchProfile();
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset success and error messages
    setSuccess(false);
    setError("");

    // Basic validation for phone number
    if (!/^\d+$/.test(profileData.phoneNumber)) {
      setError("Phone number must contain only digits.");
      return;
    }
    try {
      // Step 1: Update the profile in your database via Prisma API
      console.log("Updating local database...");
      const res = await axios.put(`/api/profile/${user.id}`, profileData);
      console.log("Local database updated:", res.data);
      // If all steps succeed
      setSuccess(true);
      setError("");
      setIsEditing(false); // Exit edit mode

    } catch (error) {
      // Detailed error logging
      console.error('Error during profile update process:', error);
      setError("Failed to update profile.");
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {error && <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">{error}</div>}
      {success && <div className="bg-green-100 text-green-600 p-3 mb-4 rounded">Profile updated successfully!</div>}

      {!isEditing ? (
        <table className="w-full mb-6 bg-white shadow-md rounded">
          <tbody>
            <tr>
              <td className="px-4 py-2 font-semibold">First Name:</td>
              <td className="px-4 py-2">{profileData.firstName}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Last Name:</td>
              <td className="px-4 py-2">{profileData.lastName}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Phone Number:</td>
              <td className="px-4 py-2">{profileData.phoneNumber}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-semibold">Email Address:</td>
              <td className="px-4 py-2">{profileData.emailAddress}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={profileData.emailAddress}
              className="w-full px-4 py-2 border rounded bg-gray-200"
              readOnly // Email cannot be edited
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      )}

      {!isEditing && (
        <button
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => setIsEditing(true)} // Enable editing mode
        >
          Edit
        </button>
      )}
    </div>
  );
}
