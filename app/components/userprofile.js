"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function ProfilePage() {
  const { user } = useUser();

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emailAddress: user?.primaryEmailAddress?.emailAddress || "",
    avatar: "",
    hidePhoneNumber: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const avatars = [
    "/avatars/avatar1.jpg",
    "/avatars/avatar2.jpg",
    "/avatars/avatar3.jpg",
    "/avatars/avatar4.jpg",
  ];

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8000/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((error) =>
        console.error("Error fetching profile details:", error)
      );

    const savedAvatar = localStorage.getItem("selectedAvatar");

    if (savedAvatar) {
      setProfileData((prevData) => ({ ...prevData, avatar: savedAvatar }));
    } else {
      setProfileData((prevData) => ({ ...prevData, avatar: "/avatars/avatar1.jpg" }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatar) => {
    setProfileData((prevData) => ({ ...prevData, avatar }));
    
    localStorage.setItem("selectedAvatar", avatar);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(profileData.phoneNumber) && !profileData.hidePhoneNumber) {
      setError("Phone number must contain only digits.");
      setSuccess(false);
      return;
    } else {
      setSuccess(false);
      setError("");

      try {
        await axios.put(`http://localhost:8000/users/${user.id}`, profileData);
        setSuccess(true);
        setIsEditing(false);
      } catch (error) {
        setError("Failed to update profile data.");
      }
    }
  };

  const avatarToDisplay = profileData.avatar || "/avatars/avatar1.jpg";

  return (
    <div className="max-w-4xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-6">My Profile</h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-600 p-3 mb-4 rounded">
          Profile updated successfully!
        </div>
      )}

      <div className="flex items-center justify-center space-x-8 mb-6">
        <img
          src={avatarToDisplay}
          alt="Profile"
          className="w-48 h-48 rounded-full object-cover border-4 border-blue-500"
        />
        {!isEditing && (
          <button
            type="button"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xl text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={profileData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded text-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-xl text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profileData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded text-lg"
              required
            />
          </div>

          <div className="mb-4 flex items-center space-x-2">
            <label className="block text-xl text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={profileData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded text-lg"
              required={!profileData.hidePhoneNumber}
              disabled={profileData.hidePhoneNumber}
            />
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer text-sm text-gray-600">Hide</label>
              <input
                type="checkbox"
                checked={profileData.hidePhoneNumber}
                onChange={() =>
                  setProfileData((prev) => ({
                    ...prev,
                    hidePhoneNumber: !prev.hidePhoneNumber,
                  }))
                }
                className="w-4 h-4"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xl text-gray-700">Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={profileData.email}
              className="w-full px-4 py-2 border rounded text-lg bg-gray-200"
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-xl text-gray-700">Select Avatar</label>
            <div className="flex space-x-4">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt={`Avatar ${index + 1}`}
                  className={`w-16 h-16 rounded-full cursor-pointer ${
                    profileData.avatar === avatar ? "border-4 border-blue-500" : ""
                  }`}
                  onClick={() => handleAvatarSelect(avatar)}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 text-lg"
          >
            Save
          </button>
        </form>
      ) : (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold">{profileData.firstName} {profileData.lastName}</div>
          </div>
          <div className="text-lg mb-2">
            <strong>Phone Number:</strong>{" "}
            {profileData.hidePhoneNumber ? "Hidden" : profileData.phoneNumber}
          </div>
          <div className="text-lg mb-2">
            <strong>Email Address:</strong> {profileData.email}
          </div>
        </div>
      )}
    </div>
  );
}
