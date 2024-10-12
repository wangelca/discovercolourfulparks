'use client';

import { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver'; // Install file-saver to handle file downloads

export default function ReportPage() {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  // Convert JSON to CSV and trigger download
  const downloadCSV = (jsonData, reportType) => {
    const headers = Object.keys(jsonData[0]);
    const csvRows = [
      headers.join(','), // header row first
      ...jsonData.map(row => headers.map(header => row[header]).join(',')) // data rows
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${reportType}_report.csv`);
  };

  // Fetch report data based on the selected type
  const fetchReport = async () => {
    setError('');
    setReportData(null);

    try {
      let response;
      if (reportType === 'userList') {
        response = await axios.get('http://localhost:8000/users');
      } else if (reportType === 'spotRevenue') {
        response = await axios.get('http://localhost:8000/spots'); // Correct endpoint for spot revenue
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
      <div className="flex space-x-4">
        <button
          onClick={fetchReport}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Generate Report
        </button>
        {reportData && (
          <button
            onClick={() => downloadCSV(reportData, reportType)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download CSV
          </button>
        )}
      </div>

      {/* Display Report Data */}
      {error && <div className="text-red-600 mt-4">{error}</div>}

      {reportData && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Report Results</h3>

          <table className="min-w-full bg-white shadow-md rounded">
            <thead>
              <tr>
                {/* Dynamically render table headers */}
                {Object.keys(reportData[0]).map((key) => (
                  <th key={key} className="px-4 py-2 border">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Dynamically render table rows */}
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
      )}
    </div>
  );
}
