'use client';

import { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  FaFileDownload,
  FaTable,
  FaCalendar,
  FaChartBar,
  FaSearch,
} from 'react-icons/fa';

export default function ReportPage() {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  // Convert JSON to CSV and trigger download
  const downloadCSV = (jsonData, reportType) => {
    const headers = Object.keys(jsonData[0]);
    const csvRows = [
      headers.join(','),
      ...jsonData.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${reportType}_report.csv`);
  };

  // Fetch report data based on the selected type
  const fetchReport = async () => {
    setError('');
    setReportData(null);
    setLoading(true);

    try {
      let response;
      if (reportType === 'userList') {
        response = await axios.get('http://localhost:8000/users');
      } else if (reportType === 'spotList') {
        response = await axios.get('http://localhost:8000/spots');
      } else if (reportType === 'eventList') {
        response = await axios.get('http://localhost:8000/events');
      } else if (reportType === 'bookingList') {
        response = await axios.get('http://localhost:8000/bookings');
      } else if (reportType === 'spotRevenue') {
        response = await axios.get('http://localhost:8000/spot-revenue', {
          params: { start_date: startDate, end_date: endDate },
        });
      }

      setReportData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to fetch the report.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full">
          <div className="bg-gray-700 px-8 py-5">
            <div className="h-12 bg-gray-600 animate-pulse rounded w-3/4 mx-auto"></div>
          </div>
          <div className="p-8">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="mb-6 flex items-center">
                <div className="h-5 bg-gray-300 animate-pulse rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-10 max-w-[2300px]">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden w-full">
        <div className="bg-gray-700 px-8 py-5 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Generate Reports</h1>
          <div className="flex items-center space-x-6">
            <span className="text-white font-bold text-lg">
              Report Generator
            </span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FaChartBar className="mr-2" /> Select Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setError('');
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a report</option>
              <option value="userList">User List</option>
              <option value="spotList">Spot List</option>
              <option value="eventList">Event List</option>
              <option value="bookingList">Booking List</option>
              <option value="spotRevenue">Spot Revenue List</option>
            </select>
          </div>

          {/* Date Range Input for Spot Revenue */}
          {reportType === 'spotRevenue' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaCalendar className="mr-2" /> Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FaCalendar className="mr-2" /> End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={fetchReport}
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaSearch className="mr-2" />
              Generate Report
            </button>
            {reportData && (
              <button
                onClick={() => downloadCSV(reportData, reportType)}
                className="flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaFileDownload className="mr-2" />
                Download CSV
              </button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}

          {/* Report Data Table */}
          {reportData && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaTable className="mr-2" /> Report Results
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr >
                      {Object.keys(reportData[0]).map((key) => (
                        <th key={key} className="px-4 py-2 border bg-gray-200">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <td key={colIndex} className="px-4 py-2 border">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
