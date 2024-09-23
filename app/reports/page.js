'use client';

import { useState } from 'react';
import axios from 'axios';
import Header from "../components/header";

export default function ReportPage() {
    <Header/>
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  // Fetch report data based on the selected type
  const fetchReport = async () => {
    setError('');
    setReportData(null);

    try {
      let response;
      if (reportType === 'userList') {
        response = await axios.get('/api/reports/userList');
      } else if (reportType === 'spotRevenue') {
        response = await axios.get('/api/reports/spotRevenue');
      }

      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to fetch the report.');
    }
  };

  return (

    <div className="max-w-4xl mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4">Generate Reports</h2>

      {/* Dropdown to select report type */}
      <div className="mb-4">
        <label className="block text-gray-700">Select Report Type</label>
        <select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        >
          <option value="">Select a report</option>
          <option value="userList">User List</option>
          <option value="spotRevenue">Spot Revenue List</option>
        </select>
      </div>

      {/* Button to generate report */}
      <button
        onClick={fetchReport}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Generate Report
      </button>

      {/* Display Report Data */}
      {error && <div className="text-red-600 mt-4">{error}</div>}

      {reportData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Report Results</h3>

          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr>
                {reportType === 'userList' && (
                  <>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Phone Number</th>
                  </>
                )}
                {reportType === 'spotRevenue' && (
                  <>
                    <th className="px-4 py-2">Spot Name</th>
                    <th className="px-4 py-2">Total Bookings</th>
                    <th className="px-4 py-2">Total Revenue</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {reportType === 'userList' &&
                reportData.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.phoneNumber}</td>
                  </tr>
                ))}
              {reportType === 'spotRevenue' &&
                reportData.map((spot) => (
                  <tr key={spot.id}>
                    <td className="px-4 py-2">{spot.name}</td>
                    <td className="px-4 py-2">{spot.booking.length}</td>
                    <td className="px-4 py-2">
                      {spot.booking.reduce((total, booking) => total + booking.amount, 0)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
