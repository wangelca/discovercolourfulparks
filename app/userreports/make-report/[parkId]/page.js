'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from "@clerk/nextjs";
import axios from 'axios';

export default function ParkReportPage() {
  const { parkId } = useParams();
  const router = useRouter();
  const { user } = useUser(); // Get the Clerk user
  
  // State variables
  const [park, setPark] = useState(null);
  const [reportType, setReportType] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  
  // Report type options
  const REPORT_TYPES = [
    { value: 'Weather Alert', label: 'Weather Alert', icon: '🌦️' },
    { value: 'Driving Conditions', label: 'Driving Conditions', icon: '🛣️' },
    { value: 'Terrain Conditions', label: 'Terrain Conditions', icon: '🏔️' },
    { value: 'Fire Sightings', label: 'Fire Sightings', icon: '🔥' },
  ];

  // Fetch park and user data
  useEffect(() => {
    // Only proceed if user is available
    if (!user) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch park data
        const parkResponse = await axios.get(`http://localhost:8000/parks/${parkId}`);
        setPark(parkResponse.data);

        // Fetch user data using Clerk user ID
        const userResponse = await axios.get(`http://localhost:8000/users/${user.id}`);
        setCurrentUser(userResponse.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.detail || 'Failed to load park or user data');
        setLoading(false);
      }
    };

    fetchData();
  }, [user, parkId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset previous errors
    setError(null);
    
    // Validation
    if (!reportType) {
      setError('Please select a report type');
      return;
    }

    if (!details.trim()) {
      setError('Please provide detailed information about the report');
      return;
    }

    // Ensure user is authenticated
    if (!currentUser) {
      setError('Please log in to submit a report');
      return;
    }

    try {
      // Prepare report data
      const reportData = {
        parkId: parseInt(parkId),
        userId: currentUser.id, // Use the backend user ID
        reportType,
        details,
      };

      // Submit the report
      const response = await axios.post('http://localhost:8000/reports', reportData);
      
      // Success handling
      alert('Report submitted successfully');
      router.push(`/parks/${parkId}`);
    } catch (error) {
      console.error('Error submitting report:', error);
      
      // Detailed error handling
      if (error.response) {
        setError(
          error.response.data.detail || 
          'Failed to submit the report. Please try again.'
        );
      } else if (error.request) {
        setError('No response from server. Please check your internet connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
};

  // Render loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error state
  if (!park) {
    return <div>Park not found</div>;
  }

  return (
    <div className="container mx-auto mt-10 p-8 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg max-w-3xl">
      {/* Error Alert */}
      {error && (
        <div 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" 
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Page Header */}
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Report for {park.name}
      </h1>

      {/* Report Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Report Type Selection */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-4">
            Select Report Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            {REPORT_TYPES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setReportType(option.value)}
                className={`
                  flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-300
                  ${reportType === option.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                  }
                `}
              >
                <span className="text-2xl">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Details Textarea */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Detailed Description
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder={`Provide comprehensive details about the ${reportType || 'report'}...`}
            className="
              w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
              resize-none h-32
            "
            required
            maxLength={500}
          />
          <p className="text-sm text-gray-500 mt-1 text-right">
            {details.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}
